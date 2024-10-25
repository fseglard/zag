import { filePathToTree, flattenedToTree, TreeCollection } from "../src/tree-collection"

let tree: TreeCollection<{ value: string; children: { value: string }[] }>

beforeEach(() => {
  tree = new TreeCollection({
    itemToChildren: (node: any) => node.children,
    items: {
      value: "ROOT",
      children: [
        {
          value: "branch1",
          children: [
            { value: "child1-1" },
            { value: "child1-2" },
            { value: "child1-3" },
            { value: "branch1-1", children: [{ value: "child2-1" }] },
          ],
        },
        { value: "child1" },
        { value: "child2" },
      ],
    },
  })
})

describe("tree", () => {
  it("should visit the tree", () => {
    expect(tree.getFirstNode()).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "value": "child1-1",
          },
          {
            "value": "child1-2",
          },
          {
            "value": "child1-3",
          },
          {
            "children": [
              {
                "value": "child2-1",
              },
            ],
            "value": "branch1-1",
          },
        ],
        "value": "branch1",
      }
    `)

    expect(tree.getLastNode()).toMatchInlineSnapshot(`
      {
        "value": "child2",
      }
    `)

    expect(tree.getValues()).toMatchInlineSnapshot(`
      [
        "branch1",
        "child1-1",
        "child1-2",
        "child1-3",
        "branch1-1",
        "child2-1",
        "child1",
        "child2",
      ]
    `)

    expect(tree.getNextNode("branch1")).toMatchInlineSnapshot(`
      {
        "value": "child1-1",
      }
    `)

    expect(tree.getPreviousNode("child1-2")).toMatchInlineSnapshot(`
      {
        "value": "child1-1",
      }
    `)

    expect(tree.getParentNode("child1-2")).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "value": "child1-1",
          },
          {
            "value": "child1-2",
          },
          {
            "value": "child1-3",
          },
          {
            "children": [
              {
                "value": "child2-1",
              },
            ],
            "value": "branch1-1",
          },
        ],
        "value": "branch1",
      }
    `)
  })

  it("branch nodes", () => {
    const branch = tree.findNode("branch1")
    expect(branch).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "value": "child1-1",
          },
          {
            "value": "child1-2",
          },
          {
            "value": "child1-3",
          },
          {
            "children": [
              {
                "value": "child2-1",
              },
            ],
            "value": "branch1-1",
          },
        ],
        "value": "branch1",
      }
    `)

    expect(tree.getBranchValues()).toMatchInlineSnapshot(`
      [
        "branch1",
        "branch1-1",
      ]
    `)

    expect(tree.getFirstNode(branch)).toMatchInlineSnapshot(`
      {
        "value": "child1-1",
      }
    `)

    expect(tree.getLastNode(branch)).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "value": "child2-1",
          },
        ],
        "value": "branch1-1",
      }
    `)
  })

  it("value path", () => {
    expect(tree.getValuePath("child1-2")).toMatchInlineSnapshot(`
      [
        "branch1",
        "child1-2",
      ]
    `)

    expect(tree.flatten()).toMatchInlineSnapshot(`
      [
        {
          "children": [
            "branch1",
            "child1",
            "child2",
          ],
          "indexPath": [],
          "label": "ROOT",
          "value": "ROOT",
        },
        {
          "children": [
            "child1-1",
            "child1-2",
            "child1-3",
            "branch1-1",
          ],
          "indexPath": [
            0,
          ],
          "label": "branch1",
          "value": "branch1",
        },
        {
          "indexPath": [
            0,
            0,
          ],
          "label": "child1-1",
          "value": "child1-1",
        },
        {
          "indexPath": [
            0,
            1,
          ],
          "label": "child1-2",
          "value": "child1-2",
        },
        {
          "indexPath": [
            0,
            2,
          ],
          "label": "child1-3",
          "value": "child1-3",
        },
        {
          "children": [
            "child2-1",
          ],
          "indexPath": [
            0,
            3,
          ],
          "label": "branch1-1",
          "value": "branch1-1",
        },
        {
          "indexPath": [
            0,
            3,
            0,
          ],
          "label": "child2-1",
          "value": "child2-1",
        },
        {
          "indexPath": [
            1,
          ],
          "label": "child1",
          "value": "child1",
        },
        {
          "indexPath": [
            2,
          ],
          "label": "child2",
          "value": "child2",
        },
      ]
    `)

    expect(
      flattenedToTree([
        {
          indexPath: [],
          value: "ROOT",
        },
        {
          indexPath: [0],
          value: "branch1",
        },
        {
          indexPath: [0, 0],
          value: "child1-1",
        },
        {
          indexPath: [0, 1],
          value: "child1-2",
        },
        {
          indexPath: [0, 2],
          value: "child1-3",
        },
        {
          indexPath: [0, 3],
          value: "branch1-1",
        },
        {
          indexPath: [0, 3, 0],
          value: "child2-1",
        },
        {
          indexPath: [1],
          value: "child1",
        },
        {
          indexPath: [2],
          value: "child2",
        },
      ]).items,
    ).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "children": [
              {
                "value": "child1-1",
              },
              {
                "value": "child1-2",
              },
              {
                "value": "child1-3",
              },
              {
                "children": [
                  {
                    "value": "child2-1",
                  },
                ],
                "value": "branch1-1",
              },
            ],
            "value": "branch1",
          },
          {
            "value": "child1",
          },
          {
            "value": "child2",
          },
        ],
        "value": "ROOT",
      }
    `)

    expect(filePathToTree(["a/b/c", "a/b/d", "a/e", "f"]).items).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "children": [
              {
                "children": [
                  {
                    "label": "c",
                    "value": "a/b/c",
                  },
                  {
                    "label": "d",
                    "value": "a/b/d",
                  },
                ],
                "label": "b",
                "value": "a/b",
              },
              {
                "label": "e",
                "value": "a/e",
              },
            ],
            "label": "a",
            "value": "a",
          },
          {
            "label": "f",
            "value": "f",
          },
        ],
        "value": "ROOT",
      }
    `)
  })
})
