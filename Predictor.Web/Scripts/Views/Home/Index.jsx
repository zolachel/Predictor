﻿var Login = React.createClass({
    getInitialState: function () {
        return { email: '', password: '', rememberMe: false, showProcessing: false };
    },
    handleEmailChange: function(e) {
        this.setState({ email: e.target.value });
    },
    handlePasswordChange: function(e) {
        this.setState({ password: e.target.value });
    },
    handleRememberMeChange: function(e) {
        this.setState({ rememberMe: !this.state.rememberMe });
    },
    handleLogin: function (e) {
        if (this.isValid()) {
            this.setState({ showProcessing: true });

            $.ajax({
                type: 'POST',
                datatype: 'json',
                url: '/Home/Login',
                data: {
                    Email: this.state.email,
                    Password: this.state.password,
                    RememberMe: this.state.rememberMe
                },
                success: function (data) {
                    if (data.toLowerCase() == 'true') {
                        if (returnUrl)
                            window.location = returnUrl;
                        else
                            window.location = '/Prediction';
                    } else {
                        this.setState({ showProcessing: false });
                        noty({ text: 'Invalid email or password.', type: 'error', theme: 'relax', killer: true });
                    }
                }.bind(this)
            });
        }
    },
    isValid: function () {
        return (this.state.email != '' && this.state.password != '' && this.isValidEmail())
    },
    isValidEmail: function() {
        var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reg.test(this.state.email);
    },
    render: function () {
        var processingShow = { display: 'block' };
        var processingHide = { display: 'none' };

        //https://github.com/google/material-design-lite/issues/1502
        //https://github.com/google/material-design-lite/pull/4263

        return (
            <div>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input className="mdl-textfield__input" type="email" id="Email" value={this.state.email} onChange={this.handleEmailChange} required />
                    <label className="mdl-textfield__label" for="Email">Email...</label>
                </div>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input className="mdl-textfield__input" type="password" id="Password" value={this.state.password} onChange={this.handlePasswordChange} required />
                    <label className="mdl-textfield__label" for="Password">Password...</label>
                </div>
                <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="RememberMe">
                    <input type="checkbox" id="RememberMe" className="mdl-checkbox__input" checked={this.state.rememberMe} onChange={this.handleRememberMeChange} />
                    <span className="mdl-checkbox__label">Remember Me</span>
                </label>
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent top-buffer-sm" onClick={this.handleLogin}>
                    Log in
                </button>
                <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate width-100-percent" style={this.state.showProcessing ? processingShow : processingHide}></div>
            </div>
        );
    }
});

ReactDOM.render(
    <Login />,
    document.getElementById('content')
)



