import { ModularLayoutPage } from './app.po';

describe('modular-layout App', () => {
  let page: ModularLayoutPage;

  beforeEach(() => {
    page = new ModularLayoutPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
