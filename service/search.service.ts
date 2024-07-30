// For the search only version
import algoliasearch from "algoliasearch";

const client = algoliasearch("090TODQB31", "4f1452e74cf602e4ded0382aa20e35bd");

const indexName = process.env.NUXT_ENV_SEARCH_INDEX_NAME;

const recipe_meta_index = client.initIndex(indexName);

// recipe_meta_index.setSettings({
//   ranking: [
//     "desc(createdAt._seconds)"
//   ]
// }).then((snap) => {
//   console.log('snap', snap);
// }).catch((err) => {
//   console.log(err);
// });

export async function getFacets(facet, pageName, recipeType, ingredientId, userName, customFilter) {
  const facets = facet === 'both' ? ["recipeTypes", "mainIngredients"] : [`${facet}`]
  let customFilters = null;
  if (pageName === 'ingredientPage') {
    customFilters = `type:recipes AND mainIngredients:"${ingredientId}"`;
  }
  else if (pageName === 'recipeTypePage') {
    if (customFilter) {
      customFilters = customFilter
    }
    else {
      customFilters = `type:recipes AND recipeTypes:"${recipeType}"`
    }
  }
  else {
    customFilters = `type:recipes AND userName:"${userName}"`
  }
  const result = await recipe_meta_index.search("", {
    facets: facets,
    attributesToRetrieve: ["facets"],
    filters: customFilters,
  })
  return result;
}

export async function getRecipes(facet, pageName, pageNo, recipeType, ingredientId, userName, customFilter) {
  const facets = facet === 'both' ? ["recipeTypes", "mainIngredients"] : [`${facet}`]
  let customFilters = null
  if (pageName === 'ingredientPage') {
    customFilters = recipeType ? `type:recipes AND recipeTypes:"${recipeType}" AND mainIngredients:"${ingredientId}"` : `type:recipes AND mainIngredients:"${ingredientId}"`;
  }
  else if (pageName === 'recipeTypePage') {
    if (customFilter) {
      customFilters = ingredientId ? `${customFilter} AND mainIngredients:"${ingredientId}"` : customFilter
    }
    else {
      customFilters = ingredientId ? `type:recipes AND recipeTypes:"${recipeType}" AND mainIngredients:"${ingredientId}"` : `type:recipes AND recipeTypes:"${recipeType}"`
    }
  }
  else {
    customFilters = recipeType ? `type:recipes AND recipeTypes:"${recipeType}" AND userName:"${userName}"` : ingredientId ? `type:recipes AND mainIngredients:"${ingredientId}" AND userName:"${userName}"` : `type:recipes AND userName:"${userName}"`
  }
  const result = await recipe_meta_index.search("", {
    facets: facets,
    page: pageNo,
    filters: customFilters,
  })
  return result;
}

export async function autoCompleteSearch(searchQuery: string, type = "all") {
  if (searchQuery) {
    const results: any = await recipe_meta_index.search(searchQuery, {
      attributesToRetrieve: ["subTitle", "title", "allNames", "type"],
      hitsPerPage: 5,
    });

    // For filtering for only one type, like ingredients
    // index.search('smartphone', {
    //   filters: 'brand:Motorola'
    // }).then(({ hits }) => {
    // });

    let flatResults = [];

    if (results.hits) {
      results.hits.map((item) => {
        if (item.allNames) {
          item.allNames.forEach((element) => {
            flatResults.push({
              name: element,
              id: item.objectID,
              type: item.type,
              typeAndCat: `${item.type} : ${element}`,
            });
          });
        } else if (item.title) {
          flatResults.push({
            name: item.title,
            id: item.objectID,
            type: item.type,
            typeAndCat: `${item.type} : ${item.title}`,
          });
        }
      });
    }
    flatResults = flatResults.map((res) => {
      if (res.type === 'recipe_types') {
        res.icon = 'mdi-open-in-new'
      }
      return res;
    })
    return flatResults;
  }
}

export async function autoCompleteSearchIngredients(searchQuery) {
  if (searchQuery) {
    const results: any = await recipe_meta_index.search(searchQuery, {
      attributesToRetrieve: ["allNames"],
      hitsPerPage: 10,
      filters: "type:ingredients",
    });

    const flatResults = [];

    if (results.hits) {
      results.hits.map((item) => {
        if (item.allNames) {
          // TODO duplicate logic in addRecipeStore.js
          item.allNames.forEach((element) => {
            flatResults.push({
              name: element,
              id: item.objectID,
              type: item.type,
              typeAndCat: `${item.type} : ${element}`,
            });
          });
        }
      });
    }

    const rawResults = results.hits;
    return { rawResults, flatResults };
  }
}

export async function submitSearch(searchObj, facetValues, filter) {
  let results = null;
  const facets = ["*"];
  let searchObject = searchObj?.length ? searchObj[searchObj?.length - 1] : searchObj ? searchObj : null
  const facetFilters = processFacetFilters(facetValues);
  //const facetFilters = [facetValues];
  if (searchObject?.type === "recipes") {
    results = await recipe_meta_index.search("", {
      facets: facets,
      attributesToRetrieve: ["*"],
      hitsPerPage: 10,
      filters: `type:recipes AND objectID:"${searchObj.id}"`,
      facetFilters: facetFilters,
    });
  } else if (searchObject?.type === "ingredients") {
    const customFilter = filter ? filter : null
    results = await recipe_meta_index.search("", {
      facets: facets,
      attributesToRetrieve: ["*"],
      hitsPerPage: 10,
      filters: customFilter,
      facetFilters: facetFilters,
    });
  } else if (searchObject?.type === "tools") {
    const customFilters = `type:recipes AND tools.id:"${searchObj.id}"`;
    results = await recipe_meta_index.search("", {
      facets: facets,
      attributesToRetrieve: ["*"],
      hitsPerPage: 10,
      filters: customFilters,
      facetFilters: facetFilters,
    });
  } else if (searchObject?.type === "cuisines") {
    const customFilters = `type:recipes AND cuisines.id:"${searchObj.id}"`;
    results = await recipe_meta_index.search("", {
      facets: facets,
      attributesToRetrieve: ["*"],
      hitsPerPage: 10,
      filters: customFilters,
      facetFilters: facetFilters,
    });
  } else if (searchObject?.type && searchObj?.id) {
    const customFilters = `type:recipes AND ${searchObj.type}.id:${searchObj.id}`;
    results = await recipe_meta_index.search("", {
      facets: facets,
      attributesToRetrieve: ["*"],
      hitsPerPage: 10,
      filters: customFilters,
      facetFilters: facetFilters,
    });
  } else {
    if (searchObj) {
      const searchQueryAttrs = {
        facets: facets,
        attributesToRetrieve: ["*"],
        hitsPerPage: 10,
        filters: `type:recipes`,
        facetFilters: facetFilters,
      };
      results = await recipe_meta_index.search(searchObj, searchQueryAttrs);
    }
  }

  return results;

  // if (searchQuery){
  //   let searchQueryString = searchQuery;
  //   let searchQueryType = null;
  //   if(searchQuery.includes(":")){
  //     const searchQueryArr = searchQuery.split(":");
  //     searchQueryType = searchQueryArr[0];
  //     searchQueryString = searchQueryArr[1]
  //   }

  //   let filters = 'type:recipes';

  //   if(searchQueryType){
  //     filters = filters + 'type:recipes AND categories.id:008zOErA8UdUH3UVFo37' ;
  //   }

  //   const results = await recipe_meta_index.search(searchQueryString, {
  //     facets: ['categories', 'cuisines', 'ingredients'],
  //     attributesToRetrieve: ["*"],
  //     hitsPerPage: 10,
  //     filters: 'type:recipes AND categories.id:008zOErA8UdUH3UVFo37'
  //   });
  //   return results.hits;
  // }
}

/*

Facets logic:

\facetFilters: [
  'attribute:value', // (single string)

  // attribute1:value AND attribute2:value (multiple strings)
  'attribute1:value', 'attribute2:value'

  // attribute1:value OR attribute2:value (multiple strings within an array)
  ['attribute1:value', 'attribute2:value'],

  // (attribute1:value OR attribute2:value) AND attribute3:value (combined strings and arrays)
  ['attribute1:value', 'attribute2:value'], 'attribute3:value',

  ...
]*/

function processFacetFilters(facetValues) {
  const v = [];
  const catCount = countFilters(facetValues, "categories.allNames");
  const toolsCount = countFilters(facetValues, "tools.allNames");
  const cuisinesCount = countFilters(facetValues, "cuisines.allNames");

  const catFacets = [];
  const cuisineFacets = [];
  const toolsFacets = [];

  facetValues.forEach(function (arrayItem) {
    if (arrayItem.includes("categories.allNames")) {
      if (catCount > 1) {
        catFacets.push(arrayItem);
      } else {
        v.push(arrayItem);
      }
    }

    if (arrayItem.includes("tools.allNames")) {
      if (toolsCount > 1) {
        toolsFacets.push(arrayItem);
      } else {
        v.push(arrayItem);
      }
    }

    if (arrayItem.includes("cuisines.allNames")) {
      if (cuisinesCount > 1) {
        cuisineFacets.push(arrayItem);
      } else {
        v.push(arrayItem);
      }
    }
  });

  if (catCount > 1) {
    v.push(catFacets);
  }

  if (toolsCount > 1) {
    v.push(toolsFacets);
  }

  if (cuisinesCount > 1) {
    v.push(cuisineFacets);
  }

  return v;
}

function countFilters(facets, key) {
  return facets.reduce(function (total, elem) {
    if (elem.includes(key)) {
      return total + 1;
    }
    return total;
  }, 0);
}
