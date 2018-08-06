import MySQL from '../model/mysql';

class User {
  constructor() {
    this.DB = new MySQL('tbUser');
  }

  login(userName, pwd) {
    const cols = ['userName', 'password'];
    const user = this.DB.getItems(cols, { userName });

    const { password } = user;
    if (pwd === password) {
      return true;
    }

    return false;
  }
}

export default User;