var ForgotPassword = React.createClass({
    getInitialState: function () {
        return { email: '', requiredEmail: false };
    },
    handleEmailChange: function(e) {
        this.setState({ email: e.target.value });
    },
    handleSubmit: function (e) {
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
        this.setState({ requiredEmail: (this.state.email == '') });
        
        return (this.state.email != '' && this.state.password != '' && isValidEmail(this.state.email));
    },
    render: function () {
        var processingDisplay = { display: this.state.showProcessing ? 'block' : 'none' };
        var notValidEmail = this.state.email == '' ? false : !isValidEmail(this.state.email);
        
        var textboxContainerClass = 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-upgraded';
        var emailContainerClass = textboxContainerClass + (this.state.email == '' ? '' : ' is-dirty') + (this.state.requiredEmail || notValidEmail ? ' is-invalid' : '');
        var passwordContainerClass = textboxContainerClass + (this.state.password == '' ? '' : ' is-dirty') + (this.state.requiredPassword ? ' is-invalid' : '');
        
        return (
            <div>
                <div className={emailContainerClass}>
                    <input className="mdl-textfield__input" type="email" id="Email" value={this.state.email} onChange={this.handleEmailChange} />
                    <label className="mdl-textfield__label" for="Email">Email...</label>
                </div>
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent top-buffer-sm" onClick={this.handleSubmit}>
                    Send Reset Password Email
                </button>
                <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate width-100-percent" style={processingDisplay}></div>
            </div>
        );
                    }
});

ReactDOM.render(
    <ForgotPassword />,
    document.getElementById('content')
)