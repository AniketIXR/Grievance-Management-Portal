import React from "react";
import "../styles/HomeScreen.css";
import {Grid , GridItem} from "@chakra-ui/react";


const homeScreen = () => {
  return (
    <>
    <Grid templateColumns="repeat(4, 1fr)" style={{marginTop:'-25px'}}>
      <GridItem colSpan='3'>
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="text-center mb-4">
        </div>
      </div>
    </section>
    </GridItem>
    <GridItem colSpan='1'>
    <div>
      <br/><br/><br/><br/><br/><br/>
    <img src="./Screenshot_from_2024-04-17_23-27-34-transformed-removebg-preview.png" className="img-fluid" alt="brand logo"/>
    <div class="slogan text-center" style={{fontSize:'20px'}}>
      <span class="smaller font-weight-bold">Resolve </span>
      <span class="smaller font-weight-bold">Restore </span>
      <span class="smaller font-weight-bold">Reimagine:</span>
      <br/>
      <span style={{fontSize:'30px'}}>Your <span class="text-success font-weight-bold" style={{fontSize:'30px'}}>Feedback,</span> Our Commitment</span>
    </div>

    </div>
    </GridItem>
    </Grid>
    </>
  );
};

export default homeScreen;
