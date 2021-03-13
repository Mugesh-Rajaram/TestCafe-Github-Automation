import { Selector, ClientFunction } from 'testcafe';
import { GIT_HOMEPAGE, PASSWORD, USER_NAME } from '../constants/constants';
import commitPageModel from '../page-model/commit.page.model';

fixture`Github Validaton`
    .page`${GIT_HOMEPAGE}`;

const updateFile = ClientFunction(() => {
    const clone = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
    const oldValue = clone.getValue();
    clone.setValue(`${oldValue} \nFile edited at ${new Date().toString()}`)
});

async function getLastUpdatedTime() {
    return await Selector('#repo-content-pjax-container [role="grid"]:nth-child(1) [role="gridcell"] time-ago').innerText;
}

test('File Modification', async t => {
    const username = USER_NAME;
    const password = PASSWORD;

    await t.click(Selector('a[href="/login"]').withExactText('Sign in'))
        .typeText(commitPageModel.userName, username)
        .typeText(commitPageModel.password, password)
        .click(Selector('.btn.btn-primary.btn-block'))
        .click(Selector('span[title="GithubLoginValidation"]')); // Repository Name

    const lastUpdateTime = await getLastUpdatedTime();

    await t.click(Selector('#readme a'));

    await updateFile();

    await t.typeText('#commit-summary-input', 'Summary')
        .typeText('#commit-description-textarea', 'Description')
        .click(Selector('#submit-file'));

    const currentUpdateTime = await Selector('#repo-content-pjax-container [itemprop="dateModified"]').innerText;
    console.log(lastUpdateTime, currentUpdateTime);
    await t.expect(lastUpdateTime).notContains(currentUpdateTime);
});