import React, { useContext, useEffect } from "react";
import Complaint from "./Complaint";
import postContext from "../context/post/postContext";
import InfiniteScroll from "react-infinite-scroll-component"
import Loader from "./Loader"
import { SimpleGrid } from "@chakra-ui/react";

const ComplaintGrid = () => {

  const contextPost = useContext(postContext);
  const { posts, getPosts, totalPosts, resetToDefaultState, filter } = contextPost;

  useEffect(() => {
    getPosts();
    return () => {resetToDefaultState()};
    //eslint-disable-next-line
  }, [filter])

  const displayPosts = posts.filter((post) => {
                        const role = localStorage.getItem('role');
                        const department = localStorage.getItem('department');
                        return (
                          (role === 'admin' && post.tags === department) ||
                          role === 'user'
                        );
                      });
  
  return (
    <>
      <InfiniteScroll
        dataLength={posts.length} //This is important field to render the next data
        next={getPosts}
        hasMore={posts.length !== totalPosts}
        loader={<Loader />}
        scrollThreshold ={0.8}
      >
        {/* <div className="row row-cols-1 row-cols-md-2 row-cols-xl-2 g-2 mx-0 my-1" > */}
        <SimpleGrid columns={2} spacing={20} margin={10} minChildWidth={700}>
        {
          displayPosts.map((post) => (
            <Complaint key={post._id} post={post} />
          ))
        }
          </SimpleGrid>
          
      </InfiniteScroll>
      {displayPosts.length===0 && <big style={{position:'relative', left:'48%'}}>No Posts!!!!</big>}
    </>
  );
};

export default ComplaintGrid;
