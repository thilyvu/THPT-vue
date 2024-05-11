<template>
  <div>
    <!--==========================
    Footer
  ============================-->
    <footer id="footer" class="section-bg">
      <div class="footer-top">
        <div class="container">
          <div class="row">
            <div class="col-lg-6">
              <div class="row">
                <div class="col-sm-6">
                  <div class="footer-info">
                    <h3 style="font-size: 26px">Millennials</h3>
                    <p>
                      We’d like to set Google Analytics cookies to help us
                      improve website by collecting information on how you use
                      it. These cookies collect information in a way that does
                      not directly identify you. For more information on how
                      these cookies work.
                    </p>
                  </div>

                  <div class="footer-newsletter">
                    <h4>Our Newsletter</h4>
                    <p>
                      We'd also like to use analytics cookies. These send
                      information about how our site is used to Google
                      Analytics, and we use this information to improve our
                      website for you.
                    </p>
                    <form action="" method="post">
                      <input type="email" name="email" /><input
                        type="submit"
                        value="Subscribe"
                      />
                    </form>
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="footer-links">
                    <h4>Useful Links</h4>
                    <ul>
                      <li><a href="#">Home</a></li>
                      <li><a href="#">About us</a></li>
                      <li><a href="#">Services</a></li>
                      <li><a href="#">Terms of service</a></li>
                      <li><a href="#">Privacy policy</a></li>
                    </ul>
                  </div>

                  <div class="footer-links">
                    <h4>Contact Us</h4>
                    <p>
                      484A Lê Văn Việt <br />
                      phường Tăng Nhơn Phú, quận 9<br />
                      tp Hồ Chí Minh <br />
                      <strong>Phone:</strong> 0563010901<br />
                      <strong>Email:</strong> thilyvu.2000@gmail.com<br />
                    </p>
                  </div>

                  <div class="social-links">
                    <a href="#" class="twitter"
                      ><i class="fa fa-twitter"></i
                    ></a>
                    <a
                      href="https://www.facebook.com/tretrauenglishclass"
                      class="facebook"
                      ><i class="fa fa-facebook"></i
                    ></a>
                    <a
                      href="https://www.linkedin.com/in/thilyvu/"
                      class="linkedin"
                      ><i class="fa fa-linkedin"></i
                    ></a>
                    <a
                      href="https://www.instagram.com/lyvu0901/"
                      class="instagram"
                      ><i class="fa fa-instagram"></i
                    ></a>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-6">
              <div class="form">
                <h4>Send us a message</h4>
                <p>
                  If you have any questions that you would like to send to us,
                  you can fill out the form below.
                </p>
                <form action="" method="post" role="form" class="contactForm">
                  <div class="form-group">
                    <input
                      type="text"
                      name="name"
                      class="form-control"
                      id="name"
                      placeholder="Your Name"
                      data-rule="minlen:4"
                      data-msg="Please enter at least 4 chars"
                    />
                    <div class="validation"></div>
                  </div>
                  <div class="form-group">
                    <input
                      type="email"
                      class="form-control"
                      name="email"
                      id="email"
                      placeholder="Your Email"
                      data-rule="email"
                      data-msg="Please enter a valid email"
                    />
                    <div class="validation"></div>
                  </div>
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      name="subject"
                      id="subject"
                      placeholder="Subject"
                      data-rule="minlen:4"
                      data-msg="Please enter at least 8 chars of subject"
                    />
                    <div class="validation"></div>
                  </div>
                  <div class="form-group">
                    <textarea
                      class="form-control"
                      name="message"
                      rows="5"
                      data-rule="required"
                      data-msg="Please write something for us"
                      placeholder="Message"
                    ></textarea>
                    <div class="validation"></div>
                  </div>

                  <div id="sendmessage">
                    Your message has been sent. Thank you!
                  </div>
                  <div id="errormessage"></div>

                  <div class="text-center">
                    <button type="submit" title="Send Message">
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="copyright">
          &copy; Copyright <strong>Millennials</strong>. All Rights Reserved
        </div>
        <div class="credits">
          <!--
          All the links in the footer should remain intact.
          You can delete the links only if you purchased the pro version.
          Licensing information: https://bootstrapmade.com/license/
          Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/buy/?theme=Rapid
        --></div>
      </div>
    </footer>
    <!-- #footer -->
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>