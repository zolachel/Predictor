var ResetPassword = React.createClass({
    getInitialState: function () {
        return {
            email: '', password: '', confirmPassword: '', showProcessing: false,
            requiredEmail: false, requiredPassword: false, requiredConfirmPassword: false
        }
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
    handleChangePassword: function (e) {
        if (this.isValid()) {
            this.setState({ showProcessing: true });

            $.ajax({
                type: 'POST',
                datatype: 'json',
                url: '/Home/ResetPassword',
                data: {
                    Email: this.state.email,
                    Password: this.state.password,
                    Code: getQueryStringByName('code')
                },
                success: function (data) {
                    this.setState({ showProcessing: false });
                    if (data) {
                        noty({
                            text: 'Your password have been changed.',
                            type: 'warning',
                            layout: 'center',
                            theme: 'relax',
                            killer: true,
                            callback: {
                                afterClose: function () {
                                    window.location = '/Home/Index';
                                }
                            }
                        });
                    } else {
                        noty({ text: 'Wrong email or invalid password format.', type: 'error', theme: 'relax', killer: true });
                    }
                }.bind(this)
            });
        }
    },
    isValid: function () {
        this.setState({
            requiredEmail: (this.state.email == ''),
            requiredPassword: (this.state.password == ''),
            requiredConfirmPassword: (this.state.confirmPassword == '' || this.state.password != this.state.confirmPassword)
        });

        return (this.state.email != '' && this.state.password != '' && this.state.confirmPassword != '' && this.state.password == this.state.confirmPassword && isValidEmail(this.state.email));
    },
    render: function () {
        var processingDisplay = { display: this.state.showProcessing ? 'block' : 'none' };
        var notValidEmail = this.state.email == '' ? false : !isValidEmail(this.state.email);

        var textboxContainerClass = 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-upgraded';
        var emailContainerClass = textboxContainerClass + (this.state.email == '' ? '' : ' is-dirty') + (this.state.requiredEmail || notValidEmail ? ' is-invalid' : '');
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
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent top-buffer-sm" onClick={this.handleChangePassword}>
                    Submit
                </button>
                <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate width-100-percent" style={processingDisplay}></div>
            </div>
        )

    }
})

ReactDOM.render(
    <ResetPassword />,
    document.getElementById('content')
)