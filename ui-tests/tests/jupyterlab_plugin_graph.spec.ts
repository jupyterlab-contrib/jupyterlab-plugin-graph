import { expect, test } from '@jupyterlab/galata';

test('should show the dependency graph of the plugins', async ({ page }) => {
  // Open the graph from the command palette.
  await page.menu.clickMenuItem('View>Activate Command Palette');
  await page.keyboard.type('Plugin Dependency Graph');
  await page
    .locator('.lm-CommandPalette-item', { hasText: 'Plugin Dependency Graph' })
    .click();

  await expect(page.locator('.jp-PluginGraph canvas')).toBeVisible();
  expect(await page.activity.isTabActive('Plugin Graph')).toBe(true);
  const counts = page.locator('.jp-PluginGraph-counts');
  await expect(counts).toHaveText(/^\d{3,} plugins · \d{3,} connections$/);

  // The plugin of this extension uses four services.
  await page
    .getByPlaceholder('Filter plugins')
    .fill('jupyterlab-plugin-graph:plugin');
  await expect(counts).toHaveText('5 plugins · 4 connections');

  await page.getByLabel('Optional').uncheck();
  await expect(counts).toHaveText('2 plugins · 1 connection');

  const layout = page.getByLabel('Layout');
  await layout.selectOption('Circular layout');
  await expect(layout).toHaveValue('circular');
  await expect(counts).toHaveText('2 plugins · 1 connection');
});
