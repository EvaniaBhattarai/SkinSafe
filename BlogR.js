"use strict";

function BlogR() {
    return (
        <div className="blog">
            <h2>Your Web Development Experience</h2>
            <p>
                I have had basic web development experience through creating an online web
                clock using CSS, Java, and HTML.
            </p>

            <h2>Link to Server Page</h2>
            <div id="serverpage">
                <p>
                    Click <a class="externallink" href="irritants" target="_blank">here</a> to see my published Server Side Page.
                </p>
            </div>
            <h2>Database Design</h2>
            <div id="database">
                <p>
                    I will create a database that contains products information for people with sensitive skin that way later on they can filter the products depending on the allergens they need to avoid.
                    Click <a target="_blank" href='images/Bhattarai_database.pdf'>here</a> to see my database document.
                </p>
                <h2>Table: product</h2>
                <ul>
                    <li>product_id (int) — Primary Key, Auto Increment</li>
                    <li>name (String) — Unique</li>
                    <li>img (String) </li>
                    <li>category (String)</li>
                    <li>manufacturer (String)</li>
                    <li>rating(int) - non character field</li>
                    <li>description (String)</li>
                    <li>price (decimal) —  non character field</li>
                    <li>web_user_id — (int) foreign key reference</li>

                </ul>
            </div>

            <h2>Your Database Experience</h2>
            <p>
                I have previously saved user login information in MySQL for my CIS 2107
                final project.
            </p>

            <h2>HW01 (Home Page)</h2>
            <p>
                I found the resources easy to navigate, the HTML syntax structure somewhat
                confusing, and the tutorials very valuable.
            </p>

            <h2>HW02 (Database)</h2>
            <p>
                I found creating my database table challenging because I had to decide
                what best fit my project idea. This caused me to remove attributes that
                did not provide value. Overall, MySQL Workbench was easy to use.
            </p>

            <h2>HW03 (SPA)</h2>
            <p>
                I found HW03’s tutorials and lab activities to be extremely helpful.
            </p>
            <h2>HW04 (JS Object Component)</h2>
            <p>
                I found tracing updating my price of my products to be difficult, as I could not understand the value that was passed v.s. the local variable (but now i do!). I found the javaScript tutorials to be extremely helpful in understanding the syntax.
            </p>
            <h2>HW05 (Web API )</h2>
            <p>
                I found playing with the sample code to be extremely helpful for this homework. Furthermore, the lab activity 
                was great to refer to when I felt confused about what certain parts of my code did. Connecting my database and adding my database fields was very easy. However, I had some difficulties while trying to produce errors in my code.
                
                Click <a target="_blank" href="docs/WebAPI_db_errors.pdf">here</a> to see my Web API error document
                To see my <strong>List Users API</strong> open up in a new tab,
                click <a href="webUser/getAll" target="_blank">here</a>.
                To see my <strong>List Product API</strong> open up in a new tab,
                click <a href="product/getAll" target="_blank">here</a>.
            </p>
            <h2>HW06 (Show LogOn Data )</h2>
            <p>
                I had a really hard time trying the merge the sort and filter together. I eventually figured it out after playing with the sample code a bit more.
                The reviewing the sample code and lab activity was extremely helpful in helping me understand what was happenning in my code. I found reviewing the criteria for 
                previous hws to be easy!
            </p>
            <h2>HW07 (Logon)</h2>
            <p>
                I initially had a hard time creating my session objects, but once i revisited the sample code I was able to create the properly. Furthermore, psuedo code in the homework instructions was very helpful, and
                allowed me to understand the basis of what my code should look like. I found creating the web APIs to be easy, as I only place the code that was absolutely necessary in the controller.
            </p>
            <h2>HW08 (Insert)</h2>
            <p>
                I initially had a hard time figuring out in which causes I needed to display and error message, but once i revisited the sample code and went through the hw pdf throughly and figured it out. Furthermore, creating the web APIs was easy, as the pdf visual were really helpful in helping me understand what needed to be displayed on the screen.
            </p>
            <h2>HW09 (Update)</h2>
            <p>
                I initially had a hard time figuring out how implement code reuse, but once i revisited the sample code and went through the hw pdf throughly and figured it out. Furthermore, testing my pages to make sure everything was implemented correctly was easy, as the pdf visual were really helpful in helping me understand what needed to be shown on the screen.
            </p>
            <h2>HW10 (Delete)</h2>
            <p>
                I had an easy time creating my delete API for my product controller. However, I had a difficult time integrating the modal_sample code, however the watching our lecture recording and playing with the code was very helpful while I was trying to understand it.
            </p>
            
        </div>
    );
}
