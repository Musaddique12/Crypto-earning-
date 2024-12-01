import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { firestore_database } from "../FireBase";

export const searchUser = async(db,id,value)=>{
    const q = query(collection(firestore_database, db), where(id, '==', value));
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return data;
}


export const update_user =async (Key,Value,userId,databse)=>{
    try{
      const docref = doc(firestore_database,databse,userId)
            await updateDoc(docref,{
                [Key]:Value
            })
    }catch(err)
    {
        console.log(err);
    }
  }