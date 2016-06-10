var Login = React.createClass({
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
        this.setState({ showProcessing: true });

        //$.ajax({
        //    type: 'POST',
        //    datatype: 'json',
        //    url: '/Home/Login',
        //    data: {
        //        Email: this.state.email,
        //        Password: this.state.password,
        //        RememberMe: this.state.rememberMe
        //    },
        //    success: function (data) {

        //        if (data.toLowerCase() == 'true') {
        //            $("#loginError").hide();
        //            var returnUrl = '@ViewBag.ReturnUrl';

        //            if (returnUrl)
        //                window.location = returnUrl;
        //            else
        //                window.location.reload();


        //        } else {
        //            $("#loginError").show();
        //        }
        //    }
        //});
    },
    render: function () {
        var processingShow = { display: 'block' };
        var processingHide = { display: 'none' };

        return (
            <div>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input className="mdl-textfield__input" type="email" id="Email" value={this.state.email} onChange={this.handleEmailChange} />
                    <label className="mdl-textfield__label" for="Email">Email...</label>
                </div>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
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
                <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate width-100-percent" style={this.state.showProcessing ? processingShow : processingHide}></div>
            </div>
        );
    }
});

ReactDOM.render(
    <Login />,
    document.getElementById('content')
)




