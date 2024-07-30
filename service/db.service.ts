// Language: typescript
// Path: service\db.service.ts

import {
  collection,
  getDocs,
  writeBatch,
  doc,
  serverTimestamp,
  limit,
  increment,
  query,
  where,
  orderBy,
  getDoc,
  setDoc,
  deleteDoc,
  arrayRemove,
  updateDoc,
  documentId,
  arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

const categoriesCollection = collection(db, "categories");
const cuisinesCollection = collection(db, "cuisines");
const toolsCollection = collection(db, "tools");
const likesCollection = collection(db, "recipeLikes");
const moderationCollection = collection(db, "moderation");
const recipeCollection = collection(db, "recipes");
const recipeTypesCollection = collection(db, "recipe_types");
const homePageCollection = collection(db, "home_page");
const usersCollection = collection(db, "users");
const ingredientsCollection = collection(db, "ingredients");
const favouritesCollection = collection(db, "favorites")

import imageCompression from "browser-image-compression";

export async function loadAllCategoriesFromDb() {
  const allCategoriesDataSnapshot = await getDocs(categoriesCollection);
  return allCategoriesDataSnapshot.docs.map((doc) => parseData(doc));
}

export async function loadAllToolsFromDb() {
  const allToolsDataSnapshot = await getDocs(toolsCollection);
  return allToolsDataSnapshot.docs.map((doc) => parseData(doc));
}

export async function loadAllCuisinesFromDb() {
  const allCuisinesDataSnapshot = await getDocs(cuisinesCollection);
  return allCuisinesDataSnapshot.docs.map((doc) => parseData(doc));
}

export async function updateRecipeToDb(recipeId, recipePartial, userId) {
  const imageUrls = await uploadImagesToStorage(recipePartial);
  recipePartial.imageUrls = imageUrls ? imageUrls : [];
  delete recipePartial.images;
  postProcessRecipeDate(recipePartial);

  const batch = writeBatch(db);

  const isDraftRecipe = recipePartial.draftId;
  recipePartial.isDraft = false;

  const recipieRef = doc(db, "recipes", recipeId);
  batch.update(recipieRef, recipePartial);

  if (isDraftRecipe && userId) {
    const draftRef = doc(db, "users", userId, "drafts", recipePartial.draftId);
    batch.delete(draftRef);
  }
  batch.commit().catch((e) => {});
}

export async function likeRecipe(uid: string, recipeId: string) {
  try {
    const ts = serverTimestamp();
    const likeObj = {
      uid: uid,
      recipeId: recipeId,
      ts: ts,
    };
    //await likesCollection.add(likeObj);

    // Get a new write batch
    const batch = writeBatch(db);

    // Set the like in recipeLikes
    const likeRef = doc(db, "recipeLikes", `${uid}-${recipeId}`);
    batch.set(likeRef, likeObj);

    const recipeCollRef = doc(db, "recipes", recipeId);
    batch.update(recipeCollRef, {
      likesCount: increment(1),
    });

    // Commit the batch
    await batch.commit();
  } catch (error) {
    console.log(error, "error");
  }
}

export async function doesUserLikeRecipe(uid: string, recipeId: string) {
  try {
    const docQuery = query(
      likesCollection,
      where("uid", "==", uid),
      where("recipeId", "==", recipeId),
      limit(1)
    );
    const docs = await getDocs(docQuery);

    if (docs.size == 1) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
}

export async function addToFavourites(uid: string, recipeId: string, remove: Boolean) {
  try {
    const ts = serverTimestamp();
    const favRef = doc(db, "favorites", recipeId);

    //set doc in firebase collection
    const batch = writeBatch(db);
    if (!remove) {
      batch.set(favRef, {
        ts: ts,
        recipeId: recipeId,
        users: arrayUnion(`${uid}`),
      }, { merge: true })
    }
    else {
      batch.set(favRef, {
        ts: ts,
        recipeId: recipeId,
        users: arrayRemove(`${uid}`),
      }, { merge: true })
    }

    await batch.commit();

  } catch (error) {
    console.log("error", error);
  }
}

export async function isAlreadyAddedToFavourites(recipeId) {
  try {
    const docQuery = query(
      favouritesCollection,
      where("recipeId", "==", recipeId),
      limit(1)
    );
    const docs = await getDocs(docQuery);
    if (docs.size == 1) {
      let data = null
      docs.forEach((doc) => { data = doc.data() })
      return data;
    }
  } catch (error) {
    return false;
  }

  return false;
}

export async function getUserFavorites(uid: String) {
  let favRecipes = []
  let allRecipes = []
  const favRecipeQuery = query(favouritesCollection, where("users", "array-contains", uid));
  const favRecipeDoc = await getDocs(favRecipeQuery);
  favRecipes = favRecipeDoc.docs.map(recipe => recipe.data())
  if (favRecipes.length) {
    for (const doc of favRecipes) {
      const recipe = await getRecipeByRecipeId(doc.recipeId)
      allRecipes.push(recipe)
    }
    return allRecipes;
  }
  else return []
}

async function getRecipeByRecipeId(recipeId: String) {
  let data = null
  const q = query(recipeCollection, where(documentId(), "==", recipeId));
  const doc = await getDocs(q);
  doc.forEach((doc) => { data = { id: doc.id, isFavSection: true, ...doc.data() } })
  return data;
}

export function postProcessRecipeDate(recipePartial) {
  const flatCatIds = recipePartial.categories.map((item) => item.id);
  const flatToolsIds = recipePartial.tools.map((item) => item.id);
  const flatCuisinesIds = recipePartial.cuisines.map((item) => item.id);

  const flatCatNames = flattenField(recipePartial?.categories);
  const flatToolsNames = flattenField(recipePartial?.tools);
  const flatCuisinesNames = flattenField(recipePartial?.cuisines);

  recipePartial.flatCatIds = flatCatIds;
  recipePartial.flatToolsIds = flatToolsIds;
  recipePartial.flatCuisinesIds = flatCuisinesIds;

  recipePartial.flatCatNames = flatCatNames;
  recipePartial.flatToolsNames = flatToolsNames;
  recipePartial.flatCuisinesNames = flatCuisinesNames;
}

export function flattenField(recipeFieldArr) {
  const flat = [];
  for (var i = 0; i < recipeFieldArr?.length; i++) {
    var allNames = recipeFieldArr[i]?.allNames;
    for (var j = 0; j < allNames?.length; j++) {
      flat.push(allNames[j]);
    }
  }
  return flat;
}

export async function saveRecipeToDb(recipe) {
  const recipeUrlName = strToSeoFriendlyUrl(recipe.title);
  recipe.relativeUrl = "/" + recipe.userName + "/" + recipeUrlName;
  recipe.recipeUrlName = recipeUrlName;
  const imageUrls = await uploadImagesToStorage(recipe);
  recipe.imageUrls = imageUrls ? imageUrls : [];
  const createdAt = serverTimestamp();
  recipe.createdAt = createdAt;
  delete recipe.images;
  postProcessRecipeDate(recipe);
  //const enableModeration = remoteConfig.getBoolean('enable_moderation');
  const enableModeration = false;

  // Creating Recipe in a batch and remove draft in user collection
  const batch = writeBatch(db);
  const isDraftRecipe = recipe.draftId;
  if (enableModeration) {
    batch.set(doc(collection(db, "moderation")), recipe);
    // await addDoc(moderationCollection, recipe);
  } else {
    recipe.isDraft = false;
    batch.set(doc(collection(db, "recipes")), recipe);
    // await addDoc(recipeCollection, recipe);
  }

  if (isDraftRecipe) {
    const draftRef = doc(
      db,
      "users",
      recipe.authorUid,
      "drafts",
      recipe.draftId
    );

    batch.delete(draftRef);
  }

  batch
    .commit()
    .then((res) => {})
    .catch((e) => {});

  //   analytics.logEvent("add_recipe", {
  //     url: recipe.relativeUrl,
  //     imageUrls: recipe.imageUrls,
  //     uid: recipe.authorUid,
  //     userName: recipe.userName,
  //   });
}

// uncomment if needed
// export async function saveModeratedRecipeToDb(recipe) {
//   await addDoc(recipeCollection, recipe);
//   //   analytics.logEvent("moderated_recipe", {
//   //     url: recipe.relativeUrl,
//   //     imageUrls: recipe.imageUrls,
//   //     uid: recipe.authorUid,
//   //     userName: recipe.userName,
//   //   });
// }

export async function uploadImagesToStorage(recipe) {
  const allImageUrls = recipe.imageUrls ? recipe.imageUrls : [];
  const allImages = recipe.images;

  if (!allImages) {
    return allImageUrls;
  }
  try {
    let imageNames = [];
    for (const imageFile of allImages) {
      let newImage = true;
      if (!imageNames.includes(imageFile.name) && recipe.userName) {
        const newImageUrl = imageFile.name;
        for (let i = 0; i < allImageUrls.length; i++) {
          if (decodeURIComponent(allImageUrls[i]).indexOf(newImageUrl) > -1) {
            newImage = false;
            break;
          }
        }
        if (newImage) {
          const value = await putStorageItem(recipe, imageFile);
          imageNames.push(imageFile.name);
          allImageUrls.push(value);
        }
      }
    }
  } catch {
    return "error";
  }

  // const values = await Promise.all(
  //   // Array of "Promises"
  //   recipe.images?.map(async (imageFile) => {
  //     const value = await putStorageItem(recipe, imageFile);
  //     allImageUrls.push(value);
  //   }));
  // ).then((urls) => {
  //   allImageUrls.push(urls);
  // })
  // .catch((error) => {
  // });

  return allImageUrls;
}

async function putStorageItem(recipe, imageFile: File) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(imageFile, options);

    const fileRef = ref(
      storage,
      `${recipe.recipeUrlName}/${recipe.userName}/${imageFile.name}`
    );

    await uploadBytes(fileRef, compressedFile);

    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (error) {
    throw error;
  }
}

export async function addProfileImage( user, imageFile) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(imageFile, options);

    const fileRef = ref(
      storage,
      `user-profile-image/${user.userName}/${imageFile.name}`
    );

    await uploadBytes(fileRef, compressedFile);

    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (error) {
    throw error;
  }
}

export async function saveUser(email, firstName, lastName, userName, uid) {
  const createdAt = serverTimestamp();

  setDoc(doc(db, "users", uid), {
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    uid: uid,
    createdAt: createdAt,
  }, { merge: true })
    .then(() => {
      //   firebase.analytics().logEvent("notification_received");
      //   analytics.logEvent("registration", {
      //     userName: userName,
      //     uid: uid,
      //     createdAt: createdAt,
      //   });
      return uid;
    })
    .catch((error) => {
      return error;
    });
}

// get recipeTypes Detail

export async function getRecipeTypesDetails(name) {
  const recipeQuery = query(
    recipeTypesCollection,
    where("allNames", "array-contains", name)
  );
  return await getDocs(recipeQuery).then((querySnapshot) => {
    let data = null;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data = { ...doc.data() };
    });
    return data;
  });
}

export async function isMainIngredient(name) {
  const ingredientQuery = await query(ingredientsCollection, where("allNames", "array-contains", name), where("isMainIngredient", "==", true));

  return await getDocs(ingredientQuery).then((querySnapshot) => {
    let data = null;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data = { id: doc.id, ...doc.data() };
    });
    return data;
  });

}

export async function getRecipeFromUrlName(
  recipeUrlName: string,
  userName: string
) {
  const relativeUrl = "/" + userName + "/" + recipeUrlName;

  const docQuery = query(
    recipeCollection,
    where("relativeUrl", "==", relativeUrl),
    limit(1)
  );

  const recipeDoc = await getDocs(docQuery);

  if (!recipeDoc.empty) {
    const snapshot = recipeDoc.docs[0];
    const id = snapshot.id;
    const data = snapshot.data();
    return { ...data, id: id };
  } else {
    // not found
  }

  // recipeCollection.where("relativeUrl", "==", relativeUrl)
  // .limit(1)
  // .get()
  // .then((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //         // doc.data() is never undefined for query doc snapshots
  //     });
  // })
  // .catch((error) => {
  // });
}

export async function getNextAvailableUserName(userName) {
  let isUserNameAvailable = false;
  let updatedUserName = userName;
  let counter = 0;
  while (!isUserNameAvailable) {
    isUserNameAvailable = await isUserNameAvailable2(updatedUserName);
    if (!isUserNameAvailable) {
      updatedUserName = userName + "-" + ++counter;
    }
  }
  return updatedUserName;
}

export async function getRecentRecipesFromDB() {
  const docQuery = query(
    recipeCollection,
    orderBy("createdAt", "desc"),
    limit(8)
  );
  const recentReipesSnapshot = await getDocs(docQuery);
  return recentReipesSnapshot.docs.map((doc) => parseData(doc));
}

// HOME PAGE RECIPES OF YOU FOLLOWS
export async function getRecipesFollowers() {
  let home_page = [];
  let recipesTags = [];
  let users = [];
  let recipeModules = []
  let recipes = {
    type: null,
    data: []
  };

  const docRef = await doc(db, "home_page", "config");
  const homePageDoc = await getDoc(docRef);
  if(homePageDoc.exists) {
    // get recipe collection document data
    const topPicsQuery = query(recipeCollection, where(documentId(), "in", homePageDoc.data().config.top_picks));
    const tagsQuery = query(recipeTypesCollection, where(documentId(), "in", homePageDoc.data().config.recipe_type_tags));
    const usersQuery = query(usersCollection, where(documentId(), "in", homePageDoc.data().config.users));

    for (const el of homePageDoc.data().config.recipe_type_modules) {
      recipes.type = el;
      const recipeModuleQuery = query(recipeCollection, where("recipeTypes", "array-contains", el), limit(4))
      const recipeModuleDoc = getDocs(recipeModuleQuery);
      (await recipeModuleDoc).docs.forEach((doc) => {
        recipes.data.push({ id: doc.id, ...doc.data() })
      })
      recipeModules.push(JSON.parse(JSON.stringify(recipes)));
      recipes.data = []
    }
    const recipeDoc = await getDocs(topPicsQuery);
    const tagsDoc = await getDocs(tagsQuery);
    const usersDoc = await getDocs(usersQuery);
    const [recipeDocs, tagsDocs, userDocs] = await Promise.all([recipeDoc, tagsDoc, usersDoc])
    home_page = recipeDocs.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    recipesTags = tagsDocs.docs.map((doc) => {
      return doc.data();
    });

    users = userDocs.docs.map((doc) => {
      return doc.data();
    });
  }
  return {
    homePage: home_page,
    recipesTags: recipesTags,
    users: users,
    recipeModules: recipeModules
  };
}

export async function getIngredientsName(ingredientId) {
  const docRef = await doc(db, "ingredients", ingredientId);
  const ingredientDoc = await getDoc(docRef);
  if (ingredientDoc.exists) {
    const ingredientName = await ingredientDoc.data()?.allNames[0];
    return ingredientName;
  } else {
    return null;
  }
}

export async function getIngredientId(name: String) {
  const ingredientQuery = query(ingredientsCollection, where("allNames", "array-contains", name))
  let id = null;
  const doc = await getDocs(ingredientQuery);
  doc.forEach((doc) => { id = doc.id })
  return id;
}

export async function getAllRecommenedRecipes(payload) {
  let docQuery;
  if (payload.type === "main-ingredient") {
    docQuery = query(
      recipeCollection,
      where(documentId(), "!=", payload.currentRecipeId),
      where("mainIngredients", "array-contains", payload.data),
      limit(4)
    );
  } else if (payload.type === "recipe-type") {
    docQuery = query(
      recipeCollection,
      where(documentId(), "!=", payload.currentRecipeId),
      where("recipeTypes", "array-contains", payload.data),
      limit(4)
    );
  } else if (payload.type === "categories") {
    docQuery = query(
      recipeCollection,
      where(documentId(), "!=", payload.currentRecipeId),
      where("flatCatNames", "array-contains", payload.data),
      limit(4)
    );
  } else if (payload.type === "cuisines") {
    docQuery = query(
      recipeCollection,
      where(documentId(), "!=", payload.currentRecipeId),
      where("flatCuisinesNames", "array-contains", payload.data),
      limit(4)
    );
  }
  const recipeDoc = await getDocs(docQuery);
  return recipeDoc.docs.map((doc) => parseData(doc));
}

export async function getAllRecipesFromRecipeName(recipeName) {
  const recipeQuery = query(
    recipeTypesCollection,
    where("allNames", "array-contains", recipeName)
  );
  let recipeData = await getDocs(recipeQuery).then((querySnapshot) => {
    let data = null;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data = { uid: doc.id, ...doc.data() };
    });
    return data;
  });
  // for leaf node recipeType
  if (!recipeData?.leafNodes?.[0]) {
    const docQuery = query(
      recipeCollection,
      where("recipeTypes", "array-contains", recipeName),
      limit(20)
    );
    const recipeDoc = await getDocs(docQuery);
    return recipeDoc.docs.map((doc) => parseData(doc));
  } else {
    // for non-leaf node recipeType
    recipeData.leafNodes = recipeData?.leafNodes.map((el) => (el = el.trim()));
    const docQuery = query(
      recipeCollection,
      where("recipeTypes", "array-contains-any", recipeData?.leafNodes),
      limit(20)
    );
    const recipeDoc = await getDocs(docQuery);
    return recipeDoc.docs.map((doc) => parseData(doc));
  }
}

export async function getRecipesToBeReviewed() {
  const docQuery = query(
    moderationCollection,
    orderBy("createdAt", "desc"),
    limit(1)
  );
  const moderationSnapshot = await getDocs(docQuery);
  return moderationSnapshot.docs.map((doc) => parseData(doc));
}

export async function deleteImageUrlFromDB(id, imageUrl, recipeProp) {
  if (id) {
    try {
      const docRef = doc(db, "recipes", id);
      await updateDoc(docRef, {
        imageUrls: arrayRemove(imageUrl),
      });
    } catch (e) {}
  }
  if (recipeProp.draftId) {
    try {
      const docRef = doc(
        db,
        "users",
        recipeProp.authorUid,
        "drafts",
        recipeProp.draftId
      );
      await updateDoc(docRef, {
        imageUrls: arrayRemove(imageUrl),
      });
    } catch (e) {}
  }
}

export async function getUser(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists) {
    const userData = { uid: userDoc.id, ...userDoc.data() };
    return userData;
  } else {
    // doc.data() will be undefined in this case
    return null;
  }
}

export async function getUserByUserName(userName: string) {
  const q = query(usersCollection, where("userName", "==", userName), limit(1));
  const userDetails = await getDocs(q);
  let user = null;
  if(!userDetails.empty){
    userDetails.forEach((doc)=>{
      user = { uid: doc.id, ...doc.data() }
    })
  }
  return user;
}

export async function updateUserDetails(aboutMe, uid) {
  const docRef = doc(db, 'users', uid);
  setDoc(docRef, aboutMe, { merge: true });
}

export async function getRecipesForUserName(userName) {
  const q = query(
    recipeCollection,
    where("userName", "==", userName),
    orderBy("createdAt", "desc")
  );

  const recipes = await getDocs(q);
  const allRecipesByUser = [];
  if (!recipes.empty) {
    recipes.forEach((doc) => {
      const recipe = { id: doc.id, ...doc.data() };
      allRecipesByUser.push(recipe);
    });
  }
  return allRecipesByUser;
}

async function isUserNameAvailable2(userName) {
  const q = query(usersCollection, where("userName", "==", userName));
  const userDoc = await getDocs(q);
  if (!userDoc.empty) {
    return false;
  }
  return true;
}

function parseData(doc) {
  const data = doc.data();
  data.id = doc.id;
  return data;
}

export function strToSeoFriendlyUrl(url) {
  // make the url lowercase
  let encodedUrl = url?.toString()?.toLowerCase();

  // replace & with and
  encodedUrl = encodedUrl.split(/\&+/).join("-and-"); //eslint-disable-line

  // remove invalid characters
  encodedUrl = encodedUrl.split(/[^a-z0-9]/).join("-");

  // remove duplicates
  encodedUrl = encodedUrl.split(/-+/).join("-");

  // trim leading & trailing characters
  encodedUrl = encodedUrl.trim("-");

  return encodedUrl;
}

export async function savePartialRecipeToDrafts(partialRecipe) {
  const uid = JSON.parse(localStorage.getItem("user"))["uid"];
  const draftId = partialRecipe.draftId;
  partialRecipe = {
    ...partialRecipe,
    timestamp: serverTimestamp(),
  };
  if (!draftId) {
  }

  await setDoc(doc(db, "users", uid, "drafts", draftId), partialRecipe);
}

export async function getAllDraftRecipes(uid) {
  const c = collection(db, "users", uid, "drafts");
  const q = query(c, orderBy("timestamp", "desc"));
  const recipeDoc = await getDocs(q);
  return recipeDoc.docs.map((doc) => parseData(doc));
}

export async function getPartialRecipeFromDrafts(draftId) {
  const uid = JSON.parse(localStorage.getItem("user"))["uid"];

  const d = doc(db, "users", uid, "drafts", draftId);
  const recipeDoc = await getDoc(d);

  return recipeDoc.data();
}

export async function deletePartialRecipeFromDrafts(draftId) {
  const uid = JSON.parse(localStorage.getItem("user"))["uid"];

  const d = doc(db, "users", uid, "drafts", draftId);
  await deleteDoc(d);
}
