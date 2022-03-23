import React, {useEffect, useState} from "react";
import {usePosts} from "../hooks/usePosts";
import {getPageCount, getPagesArray} from "../utils/Pages";
import {useFetching} from "../hooks/useFetching";
import PostService from "../API/PostService";
import MyButton from "../components/ui/button/MyButton";
import MyModal from "../components/ui/modal/MyModal";
import PostFilter from "../components/PostFilter";
import PostForm from "../components/PostForm";
import Loader from "../components/ui/loader/Loader";
import PostList from "../components/PostList";
import Pagination from "../components/ui/pagination/Pagination";

export function Posts() {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState({sort:'', query:''});
    const [modal, setModal] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
    let pagesArray = getPagesArray(totalPages);

    const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
        const response = await PostService.getAll(limit, page);
        setPosts(response.data)
        const totalCount = (response.headers['x-total-count'])
        setTotalPages(getPageCount(totalCount, limit))
    })

    useEffect(() => {
    fetchPosts()
    }, [page])

    const createPost = (newPost) => {
        setPosts([...posts, newPost])
        setModal(false)
    }

    const removePost = (post) => {
      setPosts(posts.filter(p => p.id !== post.id))
    }

    const changePage = (page) => {
        setPage(page)
    }

    return (
        <div className="App">
            <button onClick={fetchPosts}>GET POSTS</button>
            <MyButton style={{marginTop: 30}} onClick={() => setModal(true)}>
                Поделиться наболевшим
            </MyButton>
            <MyModal visible={modal} setVisible={setModal}>
            <PostForm create={createPost}/>
            </MyModal>
            <hr style={{margin:'15px 0'}}/>
            <PostFilter
                filter={filter}
                setFilter={setFilter}
            />
            {postError &&
                <h1>Произошла ошибка ${postError}</h1>
            }
            {isPostsLoading
                ?<div style={{display:'flex', justifyContent:'center', marginTop:'50px'}}><Loader/></div>
                :<PostList remove={removePost} posts={sortedAndSearchedPosts} title="Посты про JS"/>
            }
            <Pagination 
            page={page} 
            changePage={changePage} 
            totalPages={totalPages}
            />
        </div>
    );
}

export default Posts;