import React, {useState, useEffect, useHistory, useCallback, useRef, useLayoutEffect,createContext, useContext} from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, useNavigate, NavLink, useParams,useLocation, Switch, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import apiUrl from '../../../../apiUrl';
import { jwtDecode } from 'jwt-decode';



function BookPageMobile() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profileData, setProfileData] = useState({});
    const [bookData, setBookData] = useState({});
    const [menuOpen, setMenuOpen] = useState(false);
    const token = localStorage.getItem('token');
  
    const { book_id } = useParams();
    const [following, setFollowing] = useState(false);
    const [author, setAuthor] = useState('');
    const link = `https://wormates.com/book_detail/${book_id}`;
    const handleMenuOpen = () => {
      setMenuOpen(!menuOpen);
    };
  
    const handleLogout = () => {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      window.location.reload();
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const bookResponse = await axios.get(`${apiUrl}/api/book_detail/${book_id}/`);
          
          if (bookResponse.status === 200) {
            setBookData(bookResponse.data);
            const { author } = bookResponse.data;
            setAuthor(author);
          } else {
  
          }
        } catch (error) {
          console.error('Ошибка при получении данных', error);
        }
      };
  
  
      const getProfile = async () => {
        try {
          const decodedToken = jwtDecode(token);
          const username = decodedToken.username
          
          const response = await axios.get(`${apiUrl}/users/api/${username}/`, {
          });
  
          if (response.status === 200) {
            setProfileData(response.data);
          } else {
            // Обработка ошибки
          }
        } catch (error) {
          console.error('Ошибка при получении профиля', error);
        }
      };
      getProfile();
      fetchData();
    }, [book_id]);
  
  
  
  const followAuthor = async () => {
    try {
        await axios.post(`http://127.0.0.1:8000/users/api/${author}/follow/`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // После нажатия кнопки "Follow" снова проверяем статус подписки
        checkFollowing();
    } catch (error) {
        console.error("Error following author:", error);
    }
  };
  const checkFollowing = async () => {
    try {
        const decodedToken = jwtDecode(token);
        const username = decodedToken.username
        const response = await axios.get(`http://127.0.0.1:8000/users/api/${username}/following/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const followingUsers = response.data;
        const isFollowing = followingUsers.some(user => user.username === author);
        setFollowing(isFollowing);
    } catch (error) {
        console.error("Error checking following status:", error);
    }
  };
  useEffect(() => {
    if (typeof token === 'string') {
      const decodedToken = jwtDecode(token);
      const username = decodedToken.username;
      if (username && author) {
          checkFollowing();
      }
    } else {
      console.error('Invalid token:', token);
    }
  }, [author, token]);
    
    return(
  
        <div className="bookpage__books_mobile">
            <div className='bookpage__coverpage_mobile' style={{ backgroundImage: `url(${bookData.coverpage})` }}>
            <div class="bookpage__menu_mobile">
              <div className='vol'>Vol. {bookData.volume_number}</div>
              <div className='download_mobile'><svg  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.293,13.707a1,1,0,1,1,1.414-1.414L11,14.586V3a1,1,0,0,1,2,0V14.586l2.293-2.293a1,1,0,0,1,1.414,1.414l-4,4a1,1,0,0,1-.325.216.986.986,0,0,1-.764,0,1,1,0,0,1-.325-.216ZM22,12a1,1,0,0,0-1,1v7H3V13a1,1,0,0,0-2,0v8a1,1,0,0,0,1,1H22a1,1,0,0,0,1-1V13A1,1,0,0,0,22,12Z"/></svg></div>
              <button className='add_button_mobile'>Add</button>
              <div className='Read_button_mobile'>Read</div>
              <div></div>
              <div></div>
            </div>
            </div>
            <div className='bookpage__name_mobile'>
              <div className='bookpage__name_views_mobile'>{bookData.name}</div>
              <div className='bookpage__count_price_mobile'>
                <div className='count_bookpage'><svg width="32px" fill="#858585" height="32px" viewBox="0 0 12 12" enable-background="new 0 0 12 12" id="Слой_1" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">

<g>

<circle cx="6" cy="6"  r="1.5"/>

<path d="M6,2C4,2,2,3,0,6c2,3,4,4,6,4s4-1,6-4C10,3,8,2,6,2z M6,8.5C4.621582,8.5,3.5,7.3789063,3.5,6   S4.621582,3.5,6,3.5S8.5,4.6210938,8.5,6S7.378418,8.5,6,8.5z" />

</g>

</svg> {bookData.views_count} Viewings</div>
                <div className='price__bookpage'>{bookData.display_price} $</div>
              </div>
            </div>
            <div className='bookpage__author_mobile'>
              <div className='bookpage__author_info_mobile'>
                <img src={bookData.author_profile_img} alt="" />
                <div className='bookpage__author_name_mobile'>{bookData.author}</div>
                <div className='bookpage__author_fol_mobile'>{bookData.author_followers_count} Followers</div>
              </div>
              <div className='follow_button_mobile'>
              {following ? (
    <button className='fol_button_mob' onClick={followAuthor}>Following</button>
) : (<button className='fol_button_mob' onClick={followAuthor}>+ Follow</button>)}
              </div>
            </div>
        </div>
    )
  }


export default BookPageMobile;