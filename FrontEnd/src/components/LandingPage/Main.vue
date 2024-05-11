<template>
  <div>
    <!--==========================
    Intro Section
  ============================-->
    <section style="margin-top: -2.3rem" id="intro" class="clearfix">
      <div class="container d-flex h-100">
        <div class="row justify-content-center align-self-center">
          <div class="col-md-6 intro-info order-md-first order-last">
            <h2>Eduhub Solutions<br />for Your <span>Learning!</span></h2>
            <div>
              <router-link :to="{ name: 'Sign-In' }">
                <a href="#about" class="btn-get-started scrollto"
                  >Get Started
                  <i class="fa fa-arrow-right" aria-hidden="true"></i>
                </a>
              </router-link>
            </div>
          </div>

          <div class="col-md-6 intro-img order-md-last order-first">
            <img src="img/intro-img.svg" alt="" class="img-fluid" />
          </div>
        </div>
      </div>
    </section>
    <!-- #intro -->

    <main id="main">
      <!--==========================
      About Us Section
    ============================-->
      <section id="about">
        <div class="container">
          <div class="row">
            <div class="col-lg-5 col-md-6">
              <div class="about-img">
                <img
                  src="https://i.postimg.cc/44W15dnv/Screenshot-2021-12-04-003101.png"
                  alt=""
                />
              </div>
            </div>

            <div class="col-lg-7 col-md-6">
              <div class="about-content">
                <h2>About Us</h2>
                <h3>More than just an app</h3>
                <p>
                  Millennials helps you bring a modern and professional teaching
                  service to students. With Millennials, online learning becomes
                  simple and effective.
                </p>
                <p>
                  Optimize the operation process, management and increase
                  revenue for the Livestream class.Online learning allows
                  students to access education no matter where they are compared
                  to traditional learning. Furthermore, online learning promises
                  to provide optimal course pacing to suit every student's
                  needs.
                </p>
                <ul>
                  <li>
                    <i class="ion-android-checkmark-circle"></i>Convenience for
                    teachers and students.
                  </li>
                  <li>
                    <i class="ion-android-checkmark-circle"></i> Students can be
                    more active in learning.
                  </li>
                  <li>
                    <i class="ion-android-checkmark-circle"></i> Adjust the
                    learning progress according to the student's level.
                  </li>
                  <li>
                    <i class="ion-android-checkmark-circle"></i>Simple and
                    effective group learning.
                  </li>
                  <li>
                    <i class="ion-android-checkmark-circle"></i> Make the lesson
                    not boring.
                  </li>
                  <li>
                    <i class="ion-android-checkmark-circle"></i> Create a
                    comfortable study space.
                  </li>
                  <li>
                    <i class="ion-android-checkmark-circle"></i> Flexible
                    location, teaching and learning time.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- #about -->

      <!--==========================
      Services Section
    ============================-->
      <section id="services" class="section-bg">
        <div class="container">
          <header class="section-header">
            <h3>Services</h3>
            <p>
              Create a comfortable study space, Store study materials
              easily.Simple and effective group learning.
            </p>
          </header>

          <div class="row">
            <div
              class="col-md-6 col-lg-4 wow bounceInUp"
              data-wow-duration="1.4s"
            >
              <div class="box">
                <div class="icon" style="background: #fceef3">
                  <i
                    class="ion-ios-analytics-outline"
                    style="color: #ff689b"
                  ></i>
                </div>
                <h4 class="title">
                  <a href="">Archives of learning materials</a>
                </h4>
                <p class="description">
                  Each student and student will have a different level of
                  concentration. It is this difference that will greatly affect
                  the motivation of poor learners.
                </p>
              </div>
            </div>
            <div
              class="col-md-6 col-lg-4 wow bounceInUp"
              data-wow-duration="1.4s"
            >
              <div class="box">
                <div class="icon" style="background: #fff0da">
                  <i
                    class="ion-ios-bookmarks-outline"
                    style="color: #e98e06"
                  ></i>
                </div>
                <h4 class="title"><a href="">Monitor your homework</a></h4>
                <p class="description">
                  Students can manage the time they have spent studying as well
                  as manage the number of assignments so that they can review
                  the lecture when they have difficulties.
                </p>
              </div>
            </div>

            <div
              class="col-md-6 col-lg-4 wow bounceInUp"
              data-wow-delay="0.1s"
              data-wow-duration="1.4s"
            >
              <div class="box">
                <div class="icon" style="background: #e6fdfc">
                  <i class="ion-ios-paper-outline" style="color: #3fcdc7"></i>
                </div>
                <h4 class="title">
                  <a href="">Create assignments and take tests online</a>
                </h4>
                <p class="description">
                  Teachers can create lessons, add videos as well as create
                  exercises and online tests for students if needed.Provide
                  grading system for teachers
                </p>
              </div>
            </div>
            <div
              class="col-md-6 col-lg-4 wow bounceInUp"
              data-wow-delay="0.1s"
              data-wow-duration="1.4s"
            >
              <div class="box">
                <div class="icon" style="background: #eafde7">
                  <i
                    class="ion-ios-speedometer-outline"
                    style="color: #41cf2e"
                  ></i>
                </div>
                <h4 class="title">
                  <a href="">Community of teachers to share</a>
                </h4>
                <p class="description">
                  When working online, communication is most important and
                  students can easily ask their teachers about what they don't
                  understand and what they can't do.
                </p>
              </div>
            </div>

            <div
              class="col-md-6 col-lg-4 wow bounceInUp"
              data-wow-delay="0.2s"
              data-wow-duration="1.4s"
            >
              <div class="box">
                <div class="icon" style="background: #e1eeff">
                  <i class="ion-ios-world-outline" style="color: #2282ff"></i>
                </div>
                <h4 class="title"><a href="">Connect with parents</a></h4>
                <p class="description">
                  The most important thing for many parents is that when their
                  children are exposed to computers, the system provides tools
                  for parents to monitor the amount of study time.
                </p>
              </div>
            </div>
            <div
              class="col-md-6 col-lg-4 wow bounceInUp"
              data-wow-delay="0.2s"
              data-wow-duration="1.4s"
            >
              <div class="box">
                <div class="icon" style="background: #ecebff">
                  <i class="ion-ios-clock-outline" style="color: #8660fe"></i>
                </div>
                <h4 class="title">
                  <a href="">Save time traveling and studying</a>
                </h4>
                <p class="description">
                  Online learning will increase flexibility in the teaching and
                  learning process. Both parties can record the session that day
                  and review it if necessary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- #services -->

      <!--==========================
      Why Us Section
    ============================-->
      <section id="why-us" class="wow fadeIn">
        <div class="container-fluid">
          <header class="section-header">
            <h3>Why choose us?</h3>
            <p>
              Because we’re easy to work with. We take the work seriously, but
              not ourselves. We’re not prickly, precious or pretentious.
            </p>
          </header>

          <div class="row">
            <div class="col-lg-6">
              <div class="why-us-img">
                <img
                  src="https://i.postimg.cc/mgh6x3dj/263445832-2982723641976850-5516752423945441603-n.png"
                  alt=""
                  class="img-fluid"
                />
              </div>
            </div>

            <div class="col-lg-6">
              <div class="why-us-content">
                <p>
                  Because we’ve been there and done it. When you choose us,
                  you’ll feel the benefit of 15 years’ experience of writing and
                  editing.
                </p>
                <p>
                  Because we focus on results. For us, it’s all about what adds
                  value for you and your business. Above all, we want our words
                  to work for you. Because we’re easy to work with. We take the
                  work seriously, but not ourselves. We’re not prickly, precious
                  or pretentious.
                </p>

                <div class="features wow bounceInUp clearfix">
                  <i class="fa fa-diamond" style="color: #f058dc"></i>
                  <h4>Free education</h4>
                  <p>
                    The system offers many features at the cost of being
                    completely free for newbies who are passionate about
                    knowledge and want to enjoy it.
                  </p>
                </div>

                <div class="features wow bounceInUp clearfix">
                  <i class="fa fa-object-group" style="color: #ffb774"></i>
                  <h4>Many good and necessary features</h4>
                  <p>
                    The system provides many practical features such as for
                    teachers to create classes, post content about lectures,
                    create exercises as well as create online tests for
                    students. And students can choose the classes they want to
                    participate in those classes and absorb new knowledge.
                  </p>
                </div>

                <div class="features wow bounceInUp clearfix">
                  <i class="fa fa-language" style="color: #589af1"></i>
                  <h4>Large and enthusiastic community</h4>
                  <p>
                    With a large number of classes and a strong community of
                    teachers, and with nearly 18 thousand students participating
                    and studying at millennials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="container">
          <div class="row counters">
            <div class="col-lg-3 col-6 text-center">
              <span data-toggle="counter-up">2740</span>
              <p>Schools</p>
            </div>

            <div class="col-lg-3 col-6 text-center">
              <span data-toggle="counter-up">421,000</span>
              <p>Teachers</p>
            </div>

            <div class="col-lg-3 col-6 text-center">
              <span data-toggle="counter-up">1,364,000</span>
              <p>Students</p>
            </div>

            <div class="col-lg-3 col-6 text-center">
              <span data-toggle="counter-up">355,000</span>
              <p>Classes</p>
            </div>
          </div>
        </div>
      </section>

      <!--==========================
      Call To Action Section
    ============================-->
      <section id="call-to-action" class="wow fadeInUp">
        <div class="container">
          <div class="row">
            <div class="col-lg-9 text-center text-lg-left">
              <h3 class="cta-title">Call To Action</h3>
              <p class="cta-text">
                Can't wait to try our service right away, contact us now, we
                will reply within 24 hours (working day).
              </p>
            </div>
            <div class="col-lg-3 cta-btn-container text-center">
              <a class="cta-btn align-middle" href="#">Call To Action</a>
            </div>
          </div>
        </div>
      </section>
      <!-- #call-to-action -->

      <!--==========================
      Features Section
    ============================-->
      <section id="features">
        <div class="container">
          <div class="row feature-item">
            <div class="col-lg-6 wow fadeInUp">
              <img src="img/features-1.svg" class="img-fluid" alt="" />
            </div>
            <div class="col-lg-6 wow fadeInUp pt-5 pt-lg-0">
              <h4>
                Let's join hands together to build an online learning system
                during this spreading pandemic.
              </h4>
              <p>
                However, studying online also presents me with some challenges.
                Since I returned to Vietnam, I had to experience time zone
                difference while studying online.
              </p>
              <p>
                My classes take place in the UK time zone, so I usually have to
                study between 18.00–23.00 every day. Besides, we have a lot of
                group exercises. Since I am the only international student, I
                will have to follow the schedule of the native speakers in the
                group. That's why there are days when I have to stay up until
                3.00 am to do group work with my friends.
              </p>
            </div>
          </div>

          <div class="row feature-item mt-5 pt-5">
            <div class="col-lg-6 wow fadeInUp order-1 order-lg-2">
              <img src="img/features-2.svg" class="img-fluid" alt="" />
            </div>

            <div class="col-lg-6 wow fadeInUp pt-4 pt-lg-0 order-2 order-lg-1">
              <h4>
                We create a system that provides users with full features to
                study articles and review lessons during the learning process if
                desired.
              </h4>
              <p>
                Learn effectively with games and a variety of review challenges.
                Exercises by subject, by block with many levels suitable for
                each student's learning ability.
              </p>
              <p>
                The mock exam programs have a structure close to the real
                question, and support to answer questions with tutors.
              </p>
              <p>
                Challenging feature, online competition with classmates and the
                opportunity to receive many encouraging rewards, surprise gifts.
              </p>
            </div>
          </div>
        </div>
      </section>
      <!-- #about -->

      <!--==========================
      Portfolio Section
    ============================-->
      <section id="portfolio" class="section-bg">
        <div class="container">
          <header class="section-header">
            <h3 class="section-title">Our Portfolio</h3>
          </header>

          <div class="row">
            <div class="col-lg-12">
              <ul id="portfolio-flters">
                <li data-filter="*" class="filter-active">All</li>
                <li data-filter=".filter-app">App</li>
                <li data-filter=".filter-card">Card</li>
                <li data-filter=".filter-web">Web</li>
              </ul>
            </div>
          </div>

          <div class="row portfolio-container">
            <div class="col-lg-4 col-md-6 portfolio-item filter-app">
              <div class="portfolio-wrap">
                <img src="img/portfolio/app1.jpg" class="img-fluid" alt="" />
                <div class="portfolio-info">
                  <h4><a href="#">App 1</a></h4>
                  <p>App</p>
                  <div>
                    <a
                      href="img/portfolio/app1.jpg"
                      data-lightbox="portfolio"
                      data-title="App 1"
                      class="link-preview"
                      title="Preview"
                      ><i class="ion ion-eye"></i
                    ></a>
                    <a href="#" class="link-details" title="More Details"
                      ><i class="ion ion-android-open"></i
                    ></a>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="col-lg-4 col-md-6 portfolio-item filter-web"
              data-wow-delay="0.1s"
            >
              <div class="portfolio-wrap">
                <img src="img/portfolio/web3.jpg" class="img-fluid" alt="" />
                <div class="portfolio-info">
                  <h4><a href="#">Web 3</a></h4>
                  <p>Web</p>
                  <div>
                    <a
                      href="img/portfolio/web3.jpg"
                      class="link-preview"
                      data-lightbox="portfolio"
                      data-title="Web 3"
                      title="Preview"
                      ><i class="ion ion-eye"></i
                    ></a>
                    <a href="#" class="link-details" title="More Details"
                      ><i class="ion ion-android-open"></i
                    ></a>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="col-lg-4 col-md-6 portfolio-item filter-app"
              data-wow-delay="0.2s"
            >
              <div class="portfolio-wrap">
                <img src="img/portfolio/app2.jpg" class="img-fluid" alt="" />
                <div class="portfolio-info">
                  <h4><a href="#">App 2</a></h4>
                  <p>App</p>
                  <div>
                    <a
                      href="img/portfolio/app2.jpg"
                      class="link-preview"
                      data-lightbox="portfolio"
                      data-title="App 2"
                      title="Preview"
                      ><i class="ion ion-eye"></i
                    ></a>
                    <a href="#" class="link-details" title="More Details"
                      ><i class="ion ion-android-open"></i
                    ></a>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 portfolio-item filter-card">
              <div class="portfolio-wrap">
                <img src="img/portfolio/card2.jpg" class="img-fluid" alt="" />
                <div class="portfolio-info">
                  <h4><a href="#">Card 2</a></h4>
                  <p>Card</p>
                  <div>
                    <a
                      href="img/portfolio/card2.jpg"
                      class="link-preview"
                      data-lightbox="portfolio"
                      data-title="Card 2"
                      title="Preview"
                      ><i class="ion ion-eye"></i
                    ></a>
                    <a href="#" class="link-details" title="More Details"
                      ><i class="ion ion-android-open"></i
                    ></a>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="col-lg-4 col-md-6 portfolio-item filter-web"
              data-wow-delay="0.1s"
            >
              <div class="portfolio-wrap">
                <img src="img/portfolio/web2.jpg" class="img-fluid" alt="" />
                <div class="portfolio-info">
                  <h4><a href="#">Web 2</a></h4>
                  <p>Web</p>
                  <div>
                    <a
                      href="img/portfolio/web2.jpg"
                      class="link-preview"
                      data-lightbox="portfolio"
                      data-title="Web 2"
                      title="Preview"
                      ><i class="ion ion-eye"></i
                    ></a>
                    <a href="#" class="link-details" title="More Details"
                      ><i class="ion ion-android-open"></i
                    ></a>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="col-lg-4 col-md-6 portfolio-item filter-app"
              data-wow-delay="0.2s"
            >
              <div class="portfolio-wrap">
                <img src="img/portfolio/app3.jpg" class="img-fluid" alt="" />
                <div class="portfolio-info">
                  <h4><a href="#">App 3</a></h4>
                  <p>App</p>
                  <div>
                    <a
                      href="img/portfolio/app3.jpg"
                      class="link-preview"
                      data-lightbox="portfolio"
                      data-title="App 3"
                      title="Preview"
                      ><i class="ion ion-eye"></i
                    ></a>
                    <a href="#" class="link-details" title="More Details"
                      ><i class="ion ion-android-open"></i
                    ></a>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 portfolio-item filter-card">
              <div class="portfolio-wrap">
                <img src="img/portfolio/card1.jpg" class="img-fluid" alt="" />
                <div class="portfolio-info">
                  <h4><a href="#">Card 1</a></h4>
                  <p>Card</p>
                  <div>
                    <a
                      href="img/portfolio/card1.jpg"
                      class="link-preview"
                      data-lightbox="portfolio"
                      data-title="Card 1"
                      title="Preview"
                      ><i class="ion ion-eye"></i
                    ></a>
                    <a href="#" class="link-details" title="More Details"
                      ><i class="ion ion-android-open"></i
                    ></a>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="col-lg-4 col-md-6 portfolio-item filter-card"
              data-wow-delay="0.1s"
            >
              <div class="portfolio-wrap">
                <img src="img/portfolio/card3.jpg" class="img-fluid" alt="" />
                <div class="portfolio-info">
                  <h4><a href="#">Card 3</a></h4>
                  <p>Card</p>
                  <div>
                    <a
                      href="img/portfolio/card3.jpg"
                      class="link-preview"
                      data-lightbox="portfolio"
                      data-title="Card 3"
                      title="Preview"
                      ><i class="ion ion-eye"></i
                    ></a>
                    <a href="#" class="link-details" title="More Details"
                      ><i class="ion ion-android-open"></i
                    ></a>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="col-lg-4 col-md-6 portfolio-item filter-web"
              data-wow-delay="0.2s"
            >
              <div class="portfolio-wrap">
                <img src="img/portfolio/web1.jpg" class="img-fluid" alt="" />
                <div class="portfolio-info">
                  <h4><a href="#">Web 1</a></h4>
                  <p>Web</p>
                  <div>
                    <a
                      href="img/portfolio/web1.jpg"
                      class="link-preview"
                      data-lightbox="portfolio"
                      data-title="Web 1"
                      title="Preview"
                      ><i class="ion ion-eye"></i
                    ></a>
                    <a href="#" class="link-details" title="More Details"
                      ><i class="ion ion-android-open"></i
                    ></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- #portfolio -->

      <!--==========================
      Clients Section
    ============================-->
      <section id="testimonials">
        <div class="container">
          <header class="section-header">
            <h3>Testimonials</h3>
          </header>

          <div class="row justify-content-center">
            <div class="col-lg-8">
              <div class="owl-carousel testimonials-carousel wow fadeInUp">
                <div class="testimonial-item">
                  <img
                    src="img/testimonial-1.jpg"
                    class="testimonial-img"
                    alt=""
                  />
                  <h3>Saul Goodman</h3>
                  <h4>Ceo &amp; Founder</h4>
                  <p>
                    Proin iaculis purus consequat sem cure digni ssim donec
                    porttitora entum suscipit rhoncus. Accusantium quam,
                    ultricies eget id, aliquam eget nibh et. Maecen aliquam,
                    risus at semper.
                  </p>
                </div>

                <div class="testimonial-item">
                  <img
                    src="img/testimonial-2.jpg"
                    class="testimonial-img"
                    alt=""
                  />
                  <h3>Sara Wilsson</h3>
                  <h4>Designer</h4>
                  <p>
                    Export tempor illum tamen malis malis eram quae irure esse
                    labore quem cillum quid cillum eram malis quorum velit fore
                    eram velit sunt aliqua noster fugiat irure amet legam anim
                    culpa.
                  </p>
                </div>

                <div class="testimonial-item">
                  <img
                    src="img/testimonial-3.jpg"
                    class="testimonial-img"
                    alt=""
                  />
                  <h3>Jena Karlis</h3>
                  <h4>Store Owner</h4>
                  <p>
                    Enim nisi quem export duis labore cillum quae magna enim
                    sint quorum nulla quem veniam duis minim tempor labore quem
                    eram duis noster aute amet eram fore quis sint minim.
                  </p>
                </div>

                <div class="testimonial-item">
                  <img
                    src="img/testimonial-4.jpg"
                    class="testimonial-img"
                    alt=""
                  />
                  <h3>Matt Brandon</h3>
                  <h4>Freelancer</h4>
                  <p>
                    Fugiat enim eram quae cillum dolore dolor amet nulla culpa
                    multos export minim fugiat minim velit minim dolor enim duis
                    veniam ipsum anim magna sunt elit fore quem dolore labore
                    illum veniam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- #testimonials -->

      <!--==========================
      Team Section
    ============================-->
      <section id="team" class="section-bg">
        <div class="container">
          <div class="section-header">
            <h3>Team</h3>
            <p>Below are all the members who created this system</p>
          </div>

          <div class="row">
            <div class="col-lg-4 col-md-6 wow fadeInUp">
              <div class="member">
                <img
                  src="https://i.postimg.cc/gJRJkBDK/Screenshot-2021-12-04-003224.png"
                  class="img-fluid"
                  alt=""
                  style="height: 22rem"
                />
                <div class="member-info">
                  <div class="member-info-content">
                    <h4>Thi Lý Vũ</h4>
                    <span>Backend developer </span>
                    <div class="social">
                      <a href=""><i class="fa fa-twitter"></i></a>
                      <a href=""><i class="fa fa-facebook"></i></a>
                      <a href=""><i class="fa fa-google-plus"></i></a>
                      <a href=""><i class="fa fa-linkedin"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div class="member">
                <img
                  src="https://i.postimg.cc/QdNrsV4f/Screenshot-2021-12-04-070137.png"
                  class="img-fluid"
                  alt=""
                  style="height: 22rem"
                />
                <div class="member-info">
                  <div class="member-info-content">
                    <h4>Chung Thiên Nhi</h4>
                    <span>Frontend developer, tester</span>
                    <div class="social">
                      <a href=""><i class="fa fa-twitter"></i></a>
                      <a href=""><i class="fa fa-facebook"></i></a>
                      <a href=""><i class="fa fa-google-plus"></i></a>
                      <a href=""><i class="fa fa-linkedin"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.2s">
              <div class="member">
                <img
                  src="https://i.postimg.cc/yNyRvtFb/144323248-2807304972852033-7282087665130756483-n.jpg"
                  class="img-fluid"
                  alt=""
                  style="height: 22rem"
                />
                <div class="member-info">
                  <div class="member-info-content">
                    <h4>Nguyễn Quốc Ninh</h4>
                    <span>Project manager</span>
                    <div class="social">
                      <a href=""><i class="fa fa-twitter"></i></a>
                      <a href=""><i class="fa fa-facebook"></i></a>
                      <a href=""><i class="fa fa-google-plus"></i></a>
                      <a href=""><i class="fa fa-linkedin"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <div class="member">
                <img src="img/team-4.jpg" class="img-fluid" alt="" />
                <div class="member-info">
                  <div class="member-info-content">
                    <h4>Nguyễn Phan Sự</h4>
                    <span>Quality control</span>
                    <div class="social">
                      <a href=""><i class="fa fa-twitter"></i></a>
                      <a href=""><i class="fa fa-facebook"></i></a>
                      <a href=""><i class="fa fa-google-plus"></i></a>
                      <a href=""><i class="fa fa-linkedin"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
          </div>
        </div>
      </section>
      <!-- #team -->

      <!--==========================
      Clients Section
    ============================-->
      <section id="clients" class="wow fadeInUp">
        <div class="container">
          <header class="section-header">
            <h3>Our Clients</h3>
          </header>

          <div class="owl-carousel clients-carousel">
            <img src="img/clients/client-1.png" alt="" />
            <img src="img/clients/client-2.png" alt="" />
            <img src="img/clients/client-3.png" alt="" />
            <img src="img/clients/client-4.png" alt="" />
            <img src="img/clients/client-5.png" alt="" />
            <img src="img/clients/client-6.png" alt="" />
            <img src="img/clients/client-7.png" alt="" />
            <img src="img/clients/client-8.png" alt="" />
          </div>
        </div>
      </section>
      <!-- #clients -->

      <!--==========================
      Pricing Section
    ============================-->
      <section id="pricing" class="wow fadeInUp section-bg">
        <div class="container">
          <header class="section-header">
            <h3>Pricing</h3>
            <p>
              Below are the prices and packages that we offer you as follows
            </p>
          </header>

          <div class="row flex-items-xs-middle flex-items-xs-center">
            <!-- Basic Plan  -->
            <div class="col-xs-12 col-lg-4">
              <div class="card">
                <div class="card-header">
                  <h3>
                    <span class="currency">$</span>19<span class="period"
                      >/month</span
                    >
                  </h3>
                </div>
                <div class="card-block">
                  <h4 class="card-title">Basic Plan</h4>
                  <ul class="list-group">
                    <li class="list-group-item">
                      Despite the pleasures of the mind
                    </li>
                    <li class="list-group-item">And any discovered</li>
                    <li class="list-group-item">The encounter takes</li>
                    <li class="list-group-item">24/7 Support System</li>
                  </ul>
                  <a href="#" class="btn">Choose Plan</a>
                </div>
              </div>
            </div>

            <!-- Regular Plan  -->
            <div class="col-xs-12 col-lg-4">
              <div class="card">
                <div class="card-header">
                  <h3>
                    <span class="currency">$</span>29<span class="period"
                      >/month</span
                    >
                  </h3>
                </div>
                <div class="card-block">
                  <h4 class="card-title">Regular Plan</h4>
                  <ul class="list-group">
                    <li class="list-group-item">
                      Despite the pleasures of the mind
                    </li>
                    <li class="list-group-item">And any discovered</li>
                    <li class="list-group-item">The encounter takes</li>
                    <li class="list-group-item">24/7 Support System</li>
                  </ul>
                  <a href="#" class="btn">Choose Plan</a>
                </div>
              </div>
            </div>

            <!-- Premium Plan  -->
            <div class="col-xs-12 col-lg-4">
              <div class="card">
                <div class="card-header">
                  <h3>
                    <span class="currency">$</span>39<span class="period"
                      >/month</span
                    >
                  </h3>
                </div>
                <div class="card-block">
                  <h4 class="card-title">Premium Plan</h4>
                  <ul class="list-group">
                    <li class="list-group-item">
                      Despite the pleasures of the mind
                    </li>
                    <li class="list-group-item">And any discovered</li>
                    <li class="list-group-item">The encounter takes</li>
                    <li class="list-group-item">24/7 Support System</li>
                  </ul>
                  <a href="#" class="btn">Choose Plan</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- #pricing -->

      <!--==========================
      Frequently Asked Questions Section
    ============================-->
      <section id="faq">
        <div class="container">
          <header class="section-header">
            <h3>Frequently Asked Questions</h3>
            <p>Here are the questions people often ask about our system</p>
          </header>

          <ul id="faq-list" class="wow fadeInUp">
            <li>
              <a data-toggle="collapse" class="collapsed" href="#faq1"
                >If during use, where can we send feedback?
                <i class="ion-android-remove"></i
              ></a>
              <div id="faq1" class="collapse" data-parent="#faq-list">
                <p>
                  Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id
                  volutpat lacus laoreet non curabitur gravida. Venenatis lectus
                  magna fringilla urna porttitor rhoncus dolor purus non.
                </p>
              </div>
            </li>

            <li>
              <a data-toggle="collapse" href="#faq2" class="collapsed"
                >If we have new requirements for new features and want to order
                this product as a business, what should we do?
                <i class="ion-android-remove"></i
              ></a>
              <div id="faq2" class="collapse" data-parent="#faq-list">
                <p>
                  Dolor sit amet consectetur adipiscing elit pellentesque
                  habitant morbi. Id interdum velit laoreet id donec ultrices.
                  Fringilla phasellus faucibus scelerisque eleifend donec
                  pretium. Est pellentesque elit ullamcorper dignissim. Mauris
                  ultrices eros in cursus turpis massa tincidunt dui.
                </p>
              </div>
            </li>

            <li>
              <a data-toggle="collapse" href="#faq3" class="collapsed"
                >With higher requirements for hardware and software
                configuration, who can we contact?
                <i class="ion-android-remove"></i
              ></a>
              <div id="faq3" class="collapse" data-parent="#faq-list">
                <p>
                  Eleifend mi in nulla posuere sollicitudin aliquam ultrices
                  sagittis orci. Faucibus pulvinar elementum integer enim. Sem
                  nulla pharetra diam sit amet nisl suscipit. Rutrum tellus
                  pellentesque eu tincidunt. Lectus urna duis convallis
                  convallis tellus. Urna molestie at elementum eu facilisis sed
                  odio morbi quis
                </p>
              </div>
            </li>

            <li>
              <a data-toggle="collapse" href="#faq4" class="collapsed"
                >Who is the product aimed at? (For example, can people over 40,
                50 years old use it?) <i class="ion-android-remove"></i
              ></a>
              <div id="faq4" class="collapse" data-parent="#faq-list">
                <p>
                  Dolor sit amet consectetur adipiscing elit pellentesque
                  habitant morbi. Id interdum velit laoreet id donec ultrices.
                  Fringilla phasellus faucibus scelerisque eleifend donec
                  pretium. Est pellentesque elit ullamcorper dignissim. Mauris
                  ultrices eros in cursus turpis massa tincidunt dui.
                </p>
              </div>
            </li>

            <li>
              <a data-toggle="collapse" href="#faq5" class="collapsed"
                >Are user reviews/product reviews more good or bad?
                <i class="ion-android-remove"></i
              ></a>
              <div id="faq5" class="collapse" data-parent="#faq-list">
                <p>
                  Molestie a iaculis at erat pellentesque adipiscing commodo.
                  Dignissim suspendisse in est ante in. Nunc vel risus commodo
                  viverra maecenas accumsan. Sit amet nisl suscipit adipiscing
                  bibendum est. Purus gravida quis blandit turpis cursus in
                </p>
              </div>
            </li>

            <li>
              <a data-toggle="collapse" href="#faq6" class="collapsed"
                >Product's payment, return and warranty policy.
                <i class="ion-android-remove"></i
              ></a>
              <div id="faq6" class="collapse" data-parent="#faq-list">
                <p>
                  Laoreet sit amet cursus sit amet dictum sit amet justo. Mauris
                  vitae ultricies leo integer malesuada nunc vel. Tincidunt eget
                  nullam non nisi est sit amet. Turpis nunc eget lorem dolor
                  sed. Ut venenatis tellus in metus vulputate eu scelerisque.
                  Pellentesque diam volutpat commodo sed egestas egestas
                  fringilla phasellus faucibus. Nibh tellus molestie nunc non
                  blandit massa enim nec.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <!-- #faq -->
    </main>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
