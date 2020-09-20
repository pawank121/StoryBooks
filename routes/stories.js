const express = require('express');
const router = express.Router();
const {
	ensureAuth
} = require('../middleware/auth');

const Story = require('../models/Story');

// @desc Show add page
// @route GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
	res.render('stories/add');
});

// @desc Process and form
// @route POST /stories
router.post('/', ensureAuth, async (req, res) => {
	try {
		req.body.user = req.user.id;
		await Story.create(req.body);
		res.redirect('/dashboard');
	} catch (error) {
		console.log(error);
		res.render('error/500');
	}
});

// @desc Show all stories
// @route GET /stories
router.get('/', ensureAuth, async (req, res) => {
	try {
		const stories = await Story.find({
				status: 'public'
			})
			.populate('user')
			.sort({
				createdAt: 'desc'
			})
			.lean();

		res.render('stories/index', {
			stories,
		});
	} catch (error) {
		console.log(error);
		res.render('error/500');
	}
});

// @desc Show all stories by user 
// @route GET /stories/user/userID
router.get('/user/:userID', ensureAuth, async (req, res) => {
	try {
		const stories = await Story.find({
				user: req.params.userID,
				status: 'public'
			})
			.populate('user')
			.sort({
				createdAt: 'desc'
			})
			.lean();

		res.render('stories/index', {
			stories,
		});
	} catch (error) {
		console.log(error);
		res.render('error/500');
	}
});

// @desc Show single story
// @route GET /stories/:id

router.get('/:id', ensureAuth, async (req, res) => {
	try {
		let story = await Story.findById(req.params.id).populate('user').lean();

		if (!story) {
			res.render('error/404');
		}

		res.render('stories/show', {
			story: story,
		})

	} catch (error) {
		console.log(error);
		res.render('error/500');
	}
})

// @desc Show edit page
// @route GET/stories/edit:id
router.get('/edit/:id', ensureAuth, async (req, res) => {

	try {

		const story = await Story.findOne({
			_id: req.params.id,
		}).lean();

		if (!story) {
			return res.render('error/404');
		}

		if (story.user != req.user.id) {
			return res.redirect('/stories');
		} else {
			return res.render('stories/edit', {
				story: story,
			});
		}
	} catch (error) {
		console.log(error);
		return res.render('error/500')
	}
});

// @desc Update Stories
// @route PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {

	try {

		let story = await Story.findById(req.params.id).lean();
		// console.log(story);

		if (!story) {
			return res.render('error/404')
		}

		if (story.user != req.user.id) {
			return res.render('/stories')
		} else {
			story = await Story.findOneAndUpdate({
				_id: req.params.id
			}, req.body, {
				new: true,
				runValidators: true
			});

			res.redirect('/dashboard');
		}
	} catch (error) {
		console.log(error);
		return res.render('error/500')
	}
});


// @desc Delete Stories
// @route DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
	try {
		await Story.remove({
			_id: req.params.id
		})
		res.redirect('/dashboard');
	} catch (error) {
		console.log(error);
		return res.render('error/500')
	}
});

module.exports = router;