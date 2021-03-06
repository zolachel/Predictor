﻿var PredictableBox = React.createClass({
    getInitialState: function () {
        return { predictableList: [] };
    },
    componentDidMount: function () {
        $.ajax({
            url: this.props.url,
            success: function (data) {
                this.setState({ predictableList: data });
            }.bind(this)
        });
    },
    componentDidUpdate: function() {
        componentHandler.upgradeDom();
    },
    render: function () {
        return (
            <PredictableList data={this.state.predictableList} />
        )
    }
});

var PredictableList = React.createClass({
    render: function () {
        var predictableMatchs = this.props.data.map(function (node) {
            return (
                <PredictableMatch key={node.MatchId}
                                  matchId={node.MatchId}
                                  matchStartTimeUTCString={node.MatchStartTimeUTCString}
                                  nationNameHome={node.NationNameHome}
                                  nationFlagHome={node.NationFlagHome}
                                  nationNameAway={node.NationNameAway}
                                  nationFlagAway={node.NationFlagAway}
                                  remark={node.Remark}
                                  scoreHome={node.ScoreHome == null ? '' : node.ScoreHome}
                                  scoreAway={node.ScoreAway == null ? '' : node.ScoreAway}
                                  useMissile={node.UseMissile}
                                  comment={node.Comment == null ? '' : node.Comment}
                                  url="/Prediction/Predict" />
            )
        });

        return (
            <div>{ predictableMatchs }
            </div>
        )
    }
});

var PredictableMatch = React.createClass({
    getInitialState: function() {
        return {
            scoreHome: this.props.scoreHome,
            scoreAway: this.props.scoreAway,
            useMissile: this.props.useMissile,
            comment: this.props.comment,
            edited: false,
            requireScoreHome: false,
            requireScoreAway: false,
            processing: false
        };
    },
    componentDidUpdate: function () {
        componentHandler.upgradeDom();
    },
    handleScoreHomeChange: function(e) {
        this.setState({ scoreHome: e.target.value, edited: true });
    },
    handleScoreAwayChange: function (e) {
        this.setState({ scoreAway: e.target.value, edited: true });
    },
    handleUseMissileChange: function (e) {
        this.setState({ useMissile: e.target.checked, edited: true });
    },
    handleCommentChange: function (e) {
        this.setState({ comment: e.target.value, edited: true });
    },
    handleSubmit: function (e) {
        if (this.isValid()) {
            this.setState({ edited: false, processing: true });

            $.ajax({
                url: this.props.url,
                data: {
                    MatchId: this.props.matchId,
                    ScoreHome: this.state.scoreHome,
                    ScoreAway: this.state.scoreAway,
                    UseMissile: this.state.useMissile,
                    Comment: this.state.comment
                },
                success: function (data) {
                    this.setState({ processing: false });
                    noty({ text: 'Good luck babe!', type: 'success', theme: 'relax', killer: true, timeout: 3000 });
                }.bind(this)
            });
        }
    },
    isValid: function () {
        this.setState({ requireScoreHome: (this.state.scoreHome === ''), requireScoreAway: (this.state.scoreAway === '') });

        return (this.state.scoreHome !== '' && this.state.scoreAway !== '');
    },
    render: function () {
        var textboxContainerClass = 'mdl-textfield mdl-js-textfield is-upgraded';
        var scoreHomeClass = textboxContainerClass + (this.state.scoreHome == '' ? '' : ' is-dirty') + (this.state.requireScoreHome ? ' is-invalid' : '');
        var scoreAwayClass = textboxContainerClass + (this.state.scoreAway == '' ? '' : ' is-dirty') + (this.state.requireScoreAway ? ' is-invalid' : '');

        return (
            <div className="mdl-grid">
                <div className="mdl-layout-spacer"></div>
                <div className="mdl-cell mdl-cell--10-col mdl-cell--4-col-phone mdl-card mdl-shadow--4dp">
                    <div className="mdl-card__title">
                        <h3 className="mdl-card__title-text">{moment(this.props.matchStartTimeUTCString).format(DATETIME_FORMAT)}</h3>&nbsp;&nbsp;&nbsp;<span className="remark">{this.props.remark}</span>
                        { this.state.processing ? <Spiner /> : null }
                    </div>
                    <div className="mdl-card__menu">
                        <div className="mdl-layout-spacer"></div>
                        <button onClick={this.handleSubmit} disabled={!this.state.edited} className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--mini-fab mdl-button--colored">
                            <i className="material-icons">save</i>
                        </button>
                    </div>
                    <dv className="mdl-card__supporting-text">
                        <div className="mdl-grid">
                            <div className="mdl-cell mdl-cell--4-col mdl-cell--5-col-tablet mdl-cell--3-col-phone align-right">
                                <h5>{this.props.nationNameHome}<span className={this.props.nationFlagHome}></span></h5>
                            </div>
                            <div className="mdl-cell mdl-cell--1-col mdl-cell--3-col-tablet mdl-cell--1-col-phone">
                                <div className={scoreHomeClass}>
                                    <input className="mdl-textfield__input score-textbox" type="text" maxLength="1" pattern="[0-9]" id={"score-home" + this.props.matchId} value={this.state.scoreHome} onChange={this.handleScoreHomeChange} />
                                    <label className="mdl-textfield__label" for={"score-home" + this.props.matchId}>score</label>
                                </div>
                            </div>
                            <div className="mdl-cell mdl-cell--2-col mdl-cell--8-col-tablet mdl-cell--4-col-phone align-center">
                                <div className="mdl-textfield mdl-js-textfield width-auto" title="missile">
                                    <label className="mdl-switch mdl-js-switch mdl-js-ripple-effect" for={"missile" + this.props.matchId}>
                                        <input type="checkbox" id={"missile" + this.props.matchId} className="mdl-switch__input" checked={this.state.useMissile} onChange={this.handleUseMissileChange} />
                                        <span className="mdl-switch__label"></span>
                                    </label>
                                </div>
                            </div>
                            <div className="mdl-cell mdl-cell--1-col mdl-cell--3-col-tablet mdl-cell--1-col-phone">
                                <div className={scoreAwayClass}>
                                    <input className="mdl-textfield__input score-textbox" type="text" maxLength="1" pattern="[0-9]" id={"score-away" + this.props.matchId} value={this.state.scoreAway} onChange={this.handleScoreAwayChange} />
                                    <label className="mdl-textfield__label" for={"score-away" + this.props.matchId}>score</label>
                                </div>
                            </div>
                            <div className="mdl-cell mdl-cell--4-col mdl-cell--5-col-tablet mdl-cell--3-col-phone">
                                <h5><span className={this.props.nationFlagAway }></span>{this.props.nationNameAway}</h5>
                            </div>
                        </div>
                        <div className="mdl-grid">
                            <div className="mdl-layout-spacer"></div>
                            <div className="mdl-cell mdl-cell--10-col mdl-cell--8-col-tablet mdl-cell--4-col-phone">
                                <div className="mdl-textfield mdl-js-textfield width-100-percent">
                                    <input className="mdl-textfield__input" type="text" id={"comment" + this.props.matchId} value={this.state.comment} onChange={this.handleCommentChange} />
                                    <label className="mdl-textfield__label" for={"comment" + this.props.matchId}>comment</label>
                                </div>
                            </div>
                            <div className="mdl-layout-spacer"></div>
                        </div>
                    </dv>
                </div>
                <div className="mdl-layout-spacer"></div>
            </div>
        )
    }
});

var Spiner = React.createClass({
    render: function () {
        return (
            <div className="mdl-spinner mdl-js-spinner mdl-spinner--single-color is-active"></div>
        )
    }
});

ReactDOM.render(
    <PredictableBox url="/Prediction/GetPredictableMatchs" />,
    document.getElementById('content')
)