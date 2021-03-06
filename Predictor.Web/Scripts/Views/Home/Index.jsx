﻿var Login = React.createClass({
    getInitialState: function () {
        return { email: '', password: '', rememberMe: false, showProcessing: false, requiredEmail: false, requiredPassword: false };
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
                            window.location = '/Prediction/Predict';
                    } else {
                        this.setState({ showProcessing: false });
                        noty({ text: 'Invalid email or password or the user is not activated by admin.', type: 'error', theme: 'relax', killer: true });
                    }
                }.bind(this)
            });
        }
    },
    isValid: function () {
        this.setState({ requiredEmail: (this.state.email == ''), requiredPassword: (this.state.password == '') });
        
        return (this.state.email != '' && this.state.password != '' && isValidEmail(this.state.email));
    },
    render: function () {
        var processingDisplay = { display: this.state.showProcessing ? 'block' : 'none' };
        var notValidEmail = this.state.email == '' ? false : !isValidEmail(this.state.email);
        
        //https://github.com/google/material-design-lite/issues/1502
        //https://github.com/google/material-design-lite/pull/4263
        var textboxContainerClass = 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-upgraded';
        var emailContainerClass = textboxContainerClass + (this.state.email == '' ? '' : ' is-dirty') + (this.state.requiredEmail || notValidEmail ? ' is-invalid' : '');
        var passwordContainerClass = textboxContainerClass + (this.state.password == '' ? '' : ' is-dirty') + (this.state.requiredPassword ? ' is-invalid' : '');
        
        return (
            <div>
                <div className={emailContainerClass}>
                    <input className="mdl-textfield__input" type="email" id="Email" value={this.state.email} onChange={this.handleEmailChange} />
                    <label className="mdl-textfield__label" for="Email">Email...</label>
                </div>
                <div className={passwordContainerClass}>
                    <input className="mdl-textfield__input" type="password" id="Password" value={this.state.password} onChange={this.handlePasswordChange} />
                    <label className="mdl-textfield__label" for="Password">Password...</label>
                </div>
                <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="RememberMe">
                    <input type="checkbox" id="RememberMe" className="mdl-checkbox__input" checked={this.state.rememberMe} onChange={this.handleRememberMeChange} />
                    <span className="mdl-checkbox__label">Remember Me</span>
                </label>
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent top-buffer-sm" onClick={this.handleLogin}>
                    Log in
                </button>
                <a className="float-right top-buffer" href="/Home/Register">register</a> 
                <span className="float-right top-buffer">&nbsp;/&nbsp;</span>
                <a className="float-right top-buffer" href="/Home/ForgotPassword">forgot password?</a>
                <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate width-100-percent" style={processingDisplay}></div>
            </div>
        );
    }
});

ReactDOM.render(
    <Login />,
    document.getElementById('content')
)




