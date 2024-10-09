const login =  (req, res) => {
    res.render('login');
};

const adduser = (req, res) => {
    res.render('adduser');
};

const register = (req, res) => {
    res.render('register');
};

const homepage = (req, res) => {
    res.render('homepage');
}



module.exports = {
    login,
    adduser,
    register,
    homepage
}