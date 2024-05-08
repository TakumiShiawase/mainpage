import React, {useState, useEffect, useHistory, useCallback, useRef, useLayoutEffect,createContext, useContext} from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, useNavigate, NavLink, useParams,useLocation, Switch, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import apiUrl from '../../../../apiUrl.jsx';
import { jwtDecode } from 'jwt-decode';
import {SearchContext} from '../../../../context/SearchContext.jsx'


function BookItemMobile({ onScroll }) { 
    const [books, setBooks] = useState([]);
    const { searchQuery } = useContext(SearchContext);
    const bookItemRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
          const currentScrollPos = bookItemRef.current.scrollTop;
          onScroll(currentScrollPos); // Вызываем функцию обратного вызова, передавая текущую позицию прокрутки
        };
      
        const bookItemElement = bookItemRef.current;
        if (bookItemElement) {
          bookItemElement.addEventListener('scroll', handleScroll);
      
          return () => {
            bookItemElement.removeEventListener('scroll', handleScroll);
          };
        }
      }, [onScroll]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/`);
          setBooks(response.data);
        } catch (error) {
          console.error('Error fetching books:', error);
        }
      };
  
      fetchData();
    }, []);
  
    const filteredBooks = books.filter(book => 
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  

  
    return (
      <div className='book-item_mobile' ref={bookItemRef}>
  
          {filteredBooks.map(book => (
          <div className='colum_mobile' key={book.id}>
            <a href={`book_detail/${book.id}`}><div className='book-coverpage_mobile'><div className='image-overlay'>
            <a className='books-authorname_mobile' href={`profile/${book.author}`}>{book.author}</a>
                <a href={`profile/${book.author}`}><div className='book_author__img_mobile'><img src={book.author_profile_img} alt={book.author} /></div></a></div>
                <img src={book.coverpage} alt={book.name} /></div></a>
            <div className='book-info_mobile'>
                <a href={`book_detail/${book.id}`} className='books-name_mobile'>{book.name}</a>
                <div className='book_mobile_counts'>
                    <div className='book_mobile_views'><svg width="32px" fill="#ffffff" height="32px" viewBox="0 0 12 12" enable-background="new 0 0 12 12" id="Слой_1" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">

<g>

<circle cx="6" cy="6"  r="1.5"/>

<path d="M6,2C4,2,2,3,0,6c2,3,4,4,6,4s4-1,6-4C10,3,8,2,6,2z M6,8.5C4.621582,8.5,3.5,7.3789063,3.5,6   S4.621582,3.5,6,3.5S8.5,4.6210938,8.5,6S7.378418,8.5,6,8.5z" />

</g>

</svg>{book.views_count}</div>
                    <div></div>
                    <div></div>
                </div>
            </div>
          </div>
  
          ))}
  
      </div>
    );
  }

export default BookItemMobile;