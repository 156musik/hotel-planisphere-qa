import { test, expect } from '@playwright/test';

// 一般会員の情報でPC版ログイン
test('正常ログイン(一般会員)', async ({ page }) => {
  await page.goto('https://hotel-example-site.takeyaqa.dev/ja/index.html?');

  await page.locator('a:has-text("ログイン")').click();

  await page.getByRole('textbox', { name: 'メールアドレス' }).fill('sakura@example.com');
  await page.getByRole('textbox', { name: 'パスワード' }).fill('pass1234');

  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/mypage/);
  await expect(page.getByText('松本さくら')).toBeVisible();

  await page.getByRole('button', { name: 'ログアウト' }).click();
});

// プレミアム会員の情報でPC版ログイン
test('正常ログイン(プレミアム会員)', async ({ page }) => {
  await page.goto('https://hotel-example-site.takeyaqa.dev/ja/index.html?');

  await page.locator('a:has-text("ログイン")').click();

  await page.getByRole('textbox', { name: 'メールアドレス' }).fill('ichiro@example.com');
  await page.getByRole('textbox', { name: 'パスワード' }).fill('password');

  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/mypage/);
  await expect(page.getByText('山田一郎')).toBeVisible();

  await page.getByRole('button', { name: 'ログアウト' }).click();
});

// メールアドレス不備でPC版ログイン
test('異常ログイン(メールアドレス不備)', async ({ page }) => {
  await page.goto('https://hotel-example-site.takeyaqa.dev/ja/index.html?');

  await page.locator('a:has-text("ログイン")').click();

  await page.getByRole('textbox', { name: 'メールアドレス' }).fill('wrong@example.com');
  await page.getByRole('textbox', { name: 'パスワード' }).fill('password');

  await page.locator('#login-button').click();

  await expect(
    page.getByText(/メールアドレス.*パスワードが違います。/)
  ).toHaveCount(2);
});

// パスワード不備でPC版ログイン
test('異常ログイン(パスワード不備)', async ({ page }) => {
  await page.goto('https://hotel-example-site.takeyaqa.dev/ja/index.html?');

  await page.locator('a:has-text("ログイン")').click();

  await page.getByRole('textbox', { name: 'メールアドレス' }).fill('ichiro@example.com');
  await page.getByRole('textbox', { name: 'パスワード' }).fill('wrong-password');

  await page.locator('#login-button').click();
  await expect(
    page.getByText(/メールアドレス.*パスワードが違います。/)
  ).toHaveCount(2);
});