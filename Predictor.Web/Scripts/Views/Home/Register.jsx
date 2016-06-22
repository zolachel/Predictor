var Register = React.createClass({
    getInitialState: function () {
        return { email: '', password: '', confirmPassword: '', showProcessing: false, requiredEmail: false, requiredPassword: false, requiredConfirmPassword: false }
    },
    handleEmailChange: function (e) {
        this.setState({ email: e.target.value });
    },
    handlePasswordChange: function (e) {
        this.setState({ password: e.target.value });
    },
    handleConfirmPasswordChange: function (e) {
        this.setState({ confirmPassword: e.target.value });
    },
    handleRegister: function (e) {
        if (this.isValid()) {
            this.setState({ showProcessing: true });

            $.ajax({
                type: 'POST',
                datatype: 'json',
                url: '/Home/Register',
                data: {
                    Email: this.state.email,
                    Password: this.state.password,
                    ConfirmPassword: this.state.confirmPassword
                },
                success: function (data) {
                    this.setState({ showProcessing: false });

                    if (data.toLowerCase() == 'true') {
                        alert("yes");
                    } else {
                        noty({ text: 'Invalid email or password.', type: 'error', theme: 'relax', killer: true });
                    }
                }.bind(this)
            });
        }
    },
    isValid: function () {
        var reqEmail, reqPassword, reqConfirmPassword;

        if (this.state.email == '')
            reqEmail = true;
        else
            reqEmail = false;

        if (this.state.password == '')
            reqPassword = true;
        else
            reqPassword = false;

        if (this.state.confirmPassword == '' || this.state.password != this.state.confirmPassword)
            reqConfirmPassword = true;
        else
            reqConfirmPassword = false;

        this.setState({ requiredEmail: reqEmail, requiredPassword: reqPassword, requiredConfirmPassword: reqConfirmPassword });

        return (this.state.email != '' && this.state.password != '' && this.state.confirmPassword != '' && this.state.password == this.state.confirmPassword);
    },
    render: function () {
        var processingDisplay = { display: this.state.showProcessing ? 'block' : 'none' };
        var textboxContainerClass = 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-upgraded';
        var emailContainerClass = textboxContainerClass + (this.state.email == '' ? '' : ' is-dirty') + (this.state.requiredEmail ? ' is-invalid' : '');
        var passwordContainerClass = textboxContainerClass + (this.state.password == '' ? '' : ' is-dirty') + (this.state.requiredPassword ? ' is-invalid' : '');
        var confirmPasswordContainerClass = textboxContainerClass + (this.state.confirmPassword == '' ? '' : ' is-dirty') + (this.state.requiredConfirmPassword ? ' is-invalid' : '');

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
                <div className={confirmPasswordContainerClass}>
                    <input className="mdl-textfield__input" type="password" id="ConfirmPassword" value={this.state.confirmPassword} onChange={this.handleConfirmPasswordChange} />
                    <label className="mdl-textfield__label" for="ConfirmPassword">Confirm Password...</label>
                </div>
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent top-buffer-sm" onClick={this.handleRegister}>
                    Register
                </button>
                <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate width-100-percent" style={processingDisplay}></div>
            </div>   
        )
    }
})

ReactDOM.render(
    <Register />,
    document.getElementById('content')
)