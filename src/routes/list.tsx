import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { getDocs, query, orderBy } from "firebase/firestore";
import { collection } from 'firebase/firestore';

interface problemObj {
  answer: number,
  정답률: number,
  downloadUrl: string,
}

const List: React.FC = () => {
  const { folderName } = useParams();
  const [list, setList] = useState<Array<problemObj>>([])
  
  const basePath = `${folderName}`

  useEffect(()=>{
    const listRef = collection(db, `${basePath}`)
    const getList = async () => {
        const q = query(listRef, orderBy('number', 'asc'))
        const querySnapshot = await getDocs(q)
        const dataArr: Array<problemObj> = []
        querySnapshot.docs.map((doc)=>{
            const data = doc.data() as problemObj
            dataArr.push(data)
        })
        setList(dataArr)
     }
    getList()
}
,[])

  return (
    <>
      <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">{folderName}</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {list.map((item, index) => (
            <Link to={`/problem/${folderName}/${index+1}`}>
            <a key={index} href='#' className="group">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <img
                  src={item.downloadUrl}
                  alt=''
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{folderName}{index+1}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{`정답률 : ${item.정답률}`}</p>
            </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default List;
