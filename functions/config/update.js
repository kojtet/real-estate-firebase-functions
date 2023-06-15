const { db } = require("./config.js")


// Retrieve documents from the first collection
exports.updater = db.collection('users').get()
  .then((snapshot1) => {
    snapshot1.forEach((doc1) => {
      const data1 = doc1.data();
      const doc1Id = doc1.id;

      // Retrieve documents from the second collection
      db.collection('products').doc(doc1Id).get()
        .then((doc2) => {
          if (doc2.exists) {
            const data2 = doc2.data();
            const mergedData = {
              ...data1,
              ...data2
            };

            // Write merged data to the new collection
            db.collection('listings').doc(doc1Id).set(mergedData)
              .then(() => {
                console.log('Document successfully written to new collection:', doc1Id);
              })
              .catch((error) => {
                console.error('Error writing document to new collection:', error);
              });
          } else {
            console.log('Document not found in collection2:', doc1Id);
          }
        })
        .catch((error) => {
          console.error('Error retrieving document from collection2:', error);
        });
    });
  })
  .catch((error) => {
    console.error('Error retrieving documents from collection1:', error);
  });
