
<template>
<!-- <div>
 <el-row>
  <el-col :span="24" class="header_nav">
    <div>
      <img class="image_logo" src="https://tretrau.vn/wp-content/uploads/2020/02/logo-ko-vien-e1581114645289.png"/>
    </div>
    <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item class="menu_item" index="1">Teacher</el-menu-item>
      <el-menu-item class="menu_item" index="2">Student</el-menu-item>
      <el-menu-item class="menu_item" index="3">Processing Center</el-menu-item>
      <el-menu-item class="menu_item" index="4">Community</el-menu-item>
      <el-menu-item class="menu_item" index="5">About</el-menu-item>
      <el-menu-item class="menu_item" index="6">Contact</el-menu-item>
    </el-menu>
    </div>
    <div class="login_btn_container"> 
        <router-link :to="{name : 'login'}">
         <el-button  round style="border: none;" @click="handelClickLogin"> 
           <font-awesome-icon :icon="['fas', 'user']" style="margin-right: 0.5rem;"/>
            Login
          </el-button>
        </router-link> 
      <router-link :to="{name : 'signup'}">
        <el-button  round @click="handelClickSignUp">SIGN UP</el-button>
         </router-link>
    </div>
  </el-col>
</el-row>

 <el-row>
  <el-col :span="24" class="content">
    <div class="carousel-content">
      <el-carousel indicator-position="outside">
        <el-carousel-item>
          <div class="item">
            <img class="item__image" src="../../assets/banner-1176676_1920.jpg" />
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="item">
            <img class="item__image" src="../../assets/black-friday-1898114_1920.jpg" />
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="item">
            <img class="item__image" src="../../assets/nature-2813487_1920.jpg" />
          </div>
        </el-carousel-item>
        </el-carousel>
    </div>  
  </el-col>
</el-row>

 <el-row>
  <el-col :span="24" class="content">
    <div class="teacher_content">

    </div>  
  </el-col>
</el-row>

 <el-row>
  <el-col :span="24" class="content">
    <div class="student_content">

    </div>  
  </el-col>
</el-row>


 <el-row>
  <el-col :span="24" class="content">
    <div class="comunity_content">

    </div>  
  </el-col>
</el-row>


 <el-row>
  <el-col :span="24" class="content">
    <div class="comunity_content">

    </div>  
  </el-col>
</el-row>

 <el-row>
  <el-col :span="24" class="content">
    <div class="about_content">

    </div>  
  </el-col>
</el-row>

 <el-row>
  <el-col :span="24" class="content">
    <div style=" text-align: center;">
    <span class="contact_header">
          <b><u>Contact</u></b>
    </span>
    </div>
    <div class="footer_contact">
    <div class="contact_content">
            <p style="font-size:25px;"><b>Address info</b></p>
      <div>
        <div class="email_info">
          <div style="display: flex; margin-bottom: -1.5rem;">
            <font-awesome-icon :icon="['fas', 'envelope-open']" style="padding: 1rem;"/> 
            <p><b>Email</b></p>
          </div>
          
          <p style=" margin-left: 3rem;">thilyvu.2000@gmailcom</p>
          <p style=" margin-left: 3rem;">18110399@student.hcmute.edu.vn</p>
        </div>
        <div class="phone_info">
          <div style="display: flex; margin-bottom: -1.5rem; margin-top: -0.5rem;">
            <font-awesome-icon :icon="['fas', 'phone']" style="padding: 1rem;"/> 
            <p><b>Phone</b></p>
          </div>
          <p style=" margin-left: 3rem;">0782729449</p>
          <p style=" margin-left: 3rem;">0563010901</p>
        </div>
        <div>
          <div style="display: flex; margin-bottom: -1.5rem; margin-top: -0.5rem;">
            <font-awesome-icon :icon="['fas', 'map-marker-alt']" style="padding: 1rem;"/> 
            <p><b>Address</b></p>
          </div>
          <p style=" margin-left: 3rem;">
            484 Lê Văn Việt 
          </p>
          <p style=" margin-left: 3rem;">
            District 9, Ho Chi Minh City
          </p>
        </div>
      </div>
      <div>

      </div>
      <div>

      </div>
    </div> 
    <div class="subscriber">
      <p style="font-size:25px;"><b>Get in touch</b></p>
      <div class="notice_contact">
        <font-awesome-icon :icon="['fas', 'user']" style="padding: 1rem;"/> 
        <p style="margin-right: 2rem;">Name</p>
       <el-input placeholder="Name" v-model="input" style="margin-top: 1rem;"></el-input>
      </div>
      <div class="notice_contact">
        <font-awesome-icon :icon="['fas', 'envelope-open']" style="padding: 1rem;"/> 
        <p style="margin-right: 2rem;">Email</p>
       <el-input placeholder="Email" v-model="input" style="margin-top: 1rem;"></el-input>
      </div>
      <div class="notice_contact">     
         <font-awesome-icon :icon="['fas', 'phone']" style="padding: 1rem;"/> 
         <p style="margin-right: 2rem;">Phone</p>
       <el-input placeholder="Phone" v-model="input" style="margin-top: 1rem;"></el-input>
      </div>
      <div class="notice_contact">
        <font-awesome-icon :icon="['fas', 'comment-alt']" style="padding: 1rem;"/> 
        <p style="margin-right: 1rem;">Message</p>
       <el-input placeholder="Message" type="textarea" v-model="input" style="margin-top: 1rem;"   :autosize="{ minRows: 4, maxRows: 5  }"></el-input>
      </div>
    </div> 
    </div>
  </el-col>
</el-row>
</div> -->
<div>
    <headerComponent/>
    <bodyComponent/>
    <footer-component/>
</div>
</template>

<script>
import Header from './Header.vue';
import Main from './Main.vue';
import Footer from './Footer.vue'
export default {
  components:{
    headerComponent: Header,
    bodyComponent: Main,
    footerComponent: Footer
  },
    name :'Homepage',
  }
</script>

<style  scoped>
.contact_header{
  font-size: 50px;
}
.notice_contact{
  margin-top: 0.5rem;
  display: flex;
}
.subscriber{
  width: 40%;
}
.footer_contact{
  display: flex;
  justify-content: space-evenly;
}
.contact_content{
  height: 20rem;
  font-family: 'Open Sans', sans-serif;
}
.carousel-content{
  margin-top: 1rem  ;
}
.item__image{
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.login_btn_container{
  margin-top: 0.6rem;
}
.menu_item{
  font-size: 1rem;
}
.header_nav{
  display: flex;
  justify-content: space-evenly;
}
.image_logo{
  width: 10rem;
}
</style>
