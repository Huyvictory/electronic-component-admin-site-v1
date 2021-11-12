import React, { Component } from "react";
import { connect } from "react-redux";

import { showErrorMessage } from "../../services/notifyService";

import LoginForm from "../../compoments/account/LoginForm";
import { actions } from "../../actions";
import { sitePathConfig } from "../../constants/sitePathConfig";
import { UserTypes } from "../../constants";

const { getUserData } = actions;

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin(valueForm) {
    const { login, setUserData } = this.props;
    this.setState({ loading: true });

    login({
      params: valueForm,
      onCompleted: (responseData) => {
        if (responseData && responseData.token) {
          if (setUserData(responseData)) {
            // this.props.history.push(sitePathConfig.admin.path);
            if (responseData.kind === UserTypes.ADMIN)
              this.redirectToAuthPage(getUserData());
            else
              this.props.history.push(
                sitePathConfig.restaurantByShopAccount.path
              );
          }
        } else {
          this.setState({ loading: false });
          showErrorMessage(
            "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại!"
          );
        }
      },
      onError: (err) => {
        this.setState({ loading: false });
        showErrorMessage(
          "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại!"
        );
      },
    });
  }

  redirectToAuthPage(userData){
    if(!Object.keys(sitePathConfig).find(key => {
      if(sitePathConfig[key].permissions && userData.permissions.indexOf(sitePathConfig[key].permissions[0]) > -1) {
        this.props.history.push(sitePathConfig[key].path);
        return true;
      }
      return false;
    }))
      this.props.history.push(sitePathConfig.profile.path);
  }

  render() {
    const { loading } = this.state;

    return (
      <div className="login-container">
        <h1 className="page-title">ĐĂNG NHẬP</h1>
        <div className="login-content">
          <LoginForm onLogin={this.onLogin} loading={loading} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.account.loading,
});

const mapDispatchToProps = (dispatch) => ({
  login: (payload) => dispatch(actions.login(payload)),
  setUserData: (data) => actions.setUserData(data),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
