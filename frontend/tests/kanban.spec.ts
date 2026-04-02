import { expect, test } from "@playwright/test";

async function dragCardToColumn(
  cardTestId: string,
  columnTestId: string,
  page: import("@playwright/test").Page,
) {
  const card = page.getByTestId(cardTestId);
  const column = page.getByTestId(columnTestId);
  const cardBox = await card.boundingBox();
  const columnBox = await column.boundingBox();

  if (!cardBox || !columnBox) {
    throw new Error("Could not resolve drag-and-drop target boxes.");
  }

  await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(columnBox.x + columnBox.width / 2, columnBox.y + 48, {
    steps: 20,
  });
  await page.mouse.up();
}

test("supports the core kanban workflow", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /Move work forward with a lightweight board/i,
    }),
  ).toBeVisible();

  await expect(page.getByTestId("column-backlog")).toBeVisible();
  await expect(page.getByTestId("column-design")).toBeVisible();
  await expect(page.getByTestId("column-progress")).toBeVisible();
  await expect(page.getByTestId("column-review")).toBeVisible();
  await expect(page.getByTestId("column-done")).toBeVisible();

  const backlogName = page.getByLabel("Rename backlog column");
  await backlogName.fill("Ideas");
  await backlogName.press("Enter");
  await expect(backlogName).toHaveValue("Ideas");
  await expect(page.getByRole("button", { name: "Add card to Ideas" })).toBeVisible();

  await page.getByRole("button", { name: "Add card to Ideas" }).click();
  await page.getByLabel("Title").fill("Prepare stakeholder walkthrough");
  await page.getByLabel("Details").fill("Keep the flow clear and demonstrate drag-and-drop.");
  await page.getByRole("button", { name: "Create card" }).click();

  await expect(page.getByText("Prepare stakeholder walkthrough")).toBeVisible();

  await dragCardToColumn("card-card-1", "column-dropzone-review", page);

  await expect(page.getByTestId("column-review")).toContainText("Clarify launch messaging");

  await page
    .getByRole("button", { name: "Delete Prepare stakeholder walkthrough" })
    .click();
  await expect(page.getByText("Prepare stakeholder walkthrough")).toHaveCount(0);
});
