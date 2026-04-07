const jwt = require('jsonwebtoken');
const { AppError } = require('../middleware/errorHandler');

/**
 * Register new user
 */
const register = async (req, res, next) => {
  try {
    let { username, email, password, confirmPassword } = req.body;

    username = username?.trim();
    email = email?.trim().toLowerCase();
    confirmPassword = confirmPassword ?? password;

    // Validation
    if (!username || !email || !password) {
      throw new AppError('All fields are required', 400);
    }

    if (password !== confirmPassword) {
      throw new AppError('Passwords do not match', 400);
    }

    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    // Use Supabase Auth to create user
    const supabase = req.app.get('supabase');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role: 'user'
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new AppError('User already exists', 400);
      }
      throw new AppError(error.message, 400);
    }

    if (!data.user) {
      throw new AppError('Failed to create user', 500);
    }

    // Generate our own JWT token for consistency
    const token = jwt.sign(
      { id: data.user.id, email: data.user.email, role: 'user' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: data.user.id,
        username,
        email: data.user.email,
        avatar: null,
        theme: 'light',
        preferences: {
          autoplayNext: true,
          playbackSpeed: 1,
        },
        stats: {
          totalVideos: 0,
          totalCourses: 0,
          watchTime: 0,
          videosWatched: 0,
        },
        role: 'user',
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    // Special admin login
    if (email === 'admin' && password === 'admin') {
      const user = {
        _id: 'admin',
        username: 'admin',
        email: 'admin',
        avatar: null,
        theme: 'dark',
        preferences: {
          autoplayNext: true,
          playbackSpeed: 1,
        },
        stats: {
          totalVideos: 0,
          totalCourses: 0,
          watchTime: 0,
          videosWatched: 0,
        },
        role: 'admin',
      };

      const token = jwt.sign(
        { id: 'admin', email: 'admin', role: 'admin' },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '30d' }
      );

      return res.json({
        success: true,
        message: 'Logged in successfully',
        token,
        user,
      });
    }

    // Regular user login with Supabase Auth
    const supabase = req.app.get('supabase');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!data.user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate our own JWT token for consistency
    const token = jwt.sign(
      { id: data.user.id, email: data.user.email, role: data.user.user_metadata?.role || 'user' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: data.user.id,
        username: data.user.user_metadata?.username || email.split('@')[0],
        email: data.user.email,
        avatar: null,
        theme: 'light',
        preferences: {
          autoplayNext: true,
          playbackSpeed: 1,
        },
        stats: {
          totalVideos: 0,
          totalCourses: 0,
          watchTime: 0,
          videosWatched: 0,
        },
        role: data.user.user_metadata?.role || 'user',
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user
 */
const getCurrentUser = async (req, res, next) => {
  try {
    if (req.user.id === 'admin') {
      return res.json({
        success: true,
        user: {
          _id: 'admin',
          username: 'admin',
          email: 'admin',
          avatar: null,
          theme: 'dark',
          preferences: {
            autoplayNext: true,
            playbackSpeed: 1,
          },
          stats: {
            totalVideos: 0,
            totalCourses: 0,
            watchTime: 0,
            videosWatched: 0,
          },
          role: 'admin',
        },
      });
    }

    // Get user from Supabase Auth
    const supabase = req.app.get('supabase');
    const { data, error } = await supabase.auth.admin.getUserById(req.user.id);

    if (error || !data.user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      user: {
        _id: data.user.id,
        username: data.user.user_metadata?.username || data.user.email.split('@')[0],
        email: data.user.email,
        avatar: null,
        theme: 'light',
        preferences: {
          autoplayNext: true,
          playbackSpeed: 1,
        },
        stats: {
          totalVideos: 0,
          totalCourses: 0,
          watchTime: 0,
          videosWatched: 0,
        },
        role: data.user.user_metadata?.role || 'user',
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout (frontend handles token removal)
 */
const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout
};
