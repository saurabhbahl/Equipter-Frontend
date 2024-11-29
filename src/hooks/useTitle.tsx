                                                    
                                                                                                                
import { useEffect } from 'react';

export default function useTitle(title) {
    
    useEffect(() => {
        document.title = `React  - ${title}`
    }, [title]);

    return null;
}


                                                    
                                                
// import { useRef, useEffect } from 'react'

// function useDocumentTitle(title, prevailOnUnmount = false) {
//   const defaultTitle = useRef(document.title);

//   useEffect(() => {
//     document.title = title;
//   }, [title]);

//   useEffect(() => () => {
//     if (!prevailOnUnmount) {
//       document.title = defaultTitle.current;
//     }
//   }, [])
// }

// export default useDocumentTitle