import { expect, test } from '@jupyterlab/galata';

test('should show the dependency graph of the plugins', async ({ page }) => {
  await page.evaluate(() =>
    window.jupyterapp.commands.execute('jupyterlab-plugin-graph:open')
  );

  await expect(page.locator('.jp-PluginGraph canvas')).toBeVisible();
  const counts = page.locator('.jp-PluginGraph-counts');
  await expect(counts).toHaveText(/^\d{3,} plugins · \d{3,} connections$/);

  // The plugin of this extension uses four services.
  await page
    .getByPlaceholder('Filter plugins')
    .fill('jupyterlab-plugin-graph:plugin');
  await expect(counts).toHaveText('5 plugins · 4 connections');

  await page.getByLabel('Optional').uncheck();
  await expect(counts).toHaveText('2 plugins · 1 connection');
});
