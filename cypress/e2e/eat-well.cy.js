/// <reference types="cypress" />
const { Client } = require('@notionhq/client');



describe('our tour to eat-well', () => {
  const notion = new Client({ auth: `${Cypress.env('NOTION_KEY')}` });

  const page = {
    "cover": {
      "type": "external",
      "external": {
        "url": ""
      }
    },
    "parent": {
      "type": "database_id",
      "database_id": `${Cypress.env('NOTION_DATABASE_KEY')}`
    },
    "properties": {
    },
    "children": [
    ]
  };


  it('go to the page', () => {
    cy.visit(`${Cypress.env('TEST_URL')}`);
    cy.wait(1000);

    // Get cover
    cy.get('.inner-container.js-inner-container.image-overlay > img').then(node => {
      const src = node[0].getAttribute('src');
      console.log('IMG', src);

      page.cover = {
        "type": "external",
        "external": {
          "url": src
        }
      }
    })

    // Get website url
    cy.window().then((win) => {
      page.properties.Recipe = {
        "url": win.location.href
      }
    })

    // Get title
    cy.get('h1').then(node => {
      const text = node[0].innerText;
      page.children.push({
        "heading_1": {
          "rich_text": [
            {
              "text": {
                "content": text
              }
            }
          ]
        }
      })

      page.properties.Title = {
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": `🍽 : ${text}`
            }
          },
        ]
      };
    });

    // Gets the ingredients of the page
    cy.get('.ingredients-item-name').then((ingredients) => {
      for (let index = 0; index < ingredients.length; index++) {
        cy.get(ingredients[index]).then(node => {

          const text = node[0].innerText;
          page.children.push({
            "object": "block",
            "bulleted_list_item": {
              "rich_text": [{
                "type": "text",
                "text": {
                  "content": text,
                  "link": null
                }
              }],
              "color": "default",
              "children": []
            }
          })
        })
      }
    })

    // Gets number of servings.
    cy.get('.recipe-meta-item-header').contains('Servings').siblings('.recipe-meta-item-body').then((node) => {
      const text = node[0].innerText;
      page.properties.Servings = {
        "number": Number(text)
      }
    })

    // Gets the profile.
    cy.get('.nutrition-profile-item > a').then((nodes) => {
      page.properties.Profile = {
        "multi_select": []
      }

      for (let index = 0; index < nodes.length; index++) {
        const text = nodes[index].innerText;
        page.properties.Profile["multi_select"].push({
          "name": text
        })
      }
    })

    // Gets nutrition info
    cy.get('.section-body').contains('calories').then(node => {
      const text = node[0].innerText;

      const parsedValues = text.replace('Per Serving: ', '').split('; ');
      const calories = Number(parsedValues[0].match(/\d/g).join(''));

      page.properties.Calories = {
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": `${calories} kcal`
            }
          },
        ]
      }

      page.children.push({
        "object": "block",
        "divider": {}
      })

      for (let index = 1; index < parsedValues.length; index++) {
          const text = parsedValues[index];
          page.children.push({
            "object": "block",
            "bulleted_list_item": {
              "rich_text": [{
                "type": "text",
                "text": {
                  "content": text,
                  "link": null
                }
              }],
              "color": "default",
              "children": []
            }
        })
      }
    })

    // Get cooking time
    cy.get('.recipe-meta-item-header').contains('otal:').siblings().then(node => {
      const text = node[0].innerText;
      page.properties['Cooking Time'] = {
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": text
            }
          },
        ]
      };
    })
  })



  it('should call notion', () => {
    (async () => {
      const response = await notion.pages.create(page);
      console.log('RESPONSES', response);

    })();
  })
})