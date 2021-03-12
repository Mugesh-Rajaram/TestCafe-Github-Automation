import { Selector } from 'testcafe'

class CommitPageModel {

    constructor() {
        this.userName = Selector('#login_field');
        this.password = Selector('#password')
    }

}

export default new CommitPageModel();