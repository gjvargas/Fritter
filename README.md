Fritter

////////////////
Project 2
///////////////

The goal for the beta was to build a social networking web site through which
users can create accounts, log in and out, write/edit/delete posts, and see
posts of all other users. My beta implementation pretty much supports the bare
minimum. I use session variables for logging in and  interacting with the posts.
When users log in, they are given permission to post new content, or edit any
previous posts they have made as they scroll through the post history.

My design was a simple one. First I have a login page with a simple login form.
From here you can be redirected to create a new account, login with your account
and browse/post, or browse anonymously. I chose to have the login page at startup
because at my 'social media company' we want all of our users to have accounts and
be active members of the community. For the same reason, I put the browse
anonymously link in the bottom right corner of the page, to discourage users from
lurking. The create account page looks similar to the login page, with a link to
return to the login page in case users change their minds. The main focus of
both pages is the login/signup form. I chose to design it this way to encourage
using membership accounts. Once either form is submitted, the user is redirected
to the posts page. The user can also get here through the 'browse anonymously'
link. The page looks different though if the user is not logged in. All you
see when browsing anonymously is the list of posts previously made by users,
and a sign in link at the very bottom. However if logged in, the first thing the
user sees is a field to make a new post. My company wants people to speak their
mind, so the first option we give to our user is to make a post. After this prompt
the user can scroll through all of the posts made in the past. Posts made by other
users are colored to match the page, however posts made by the user are simply
input fields, so that the user can easily change their previous posts. Through
this dichotomy, users can easily distinguish their own posts from others and then
edit and delete them easily while browsing. I implemented it this way so that
users can undo their actions, and don't feel at all committed to their posts.
Also, the posts are listed in order of recency. Finally, at the bottom of the page,
past all of the posts, there is a link for users to sign out. I put it all the
way at the bottom for two reasons. First it discourages users from signing out,
and second, to simplify the user experience by greeting them only with the
content that they are here for.

To support the persistent database, I used mongodb. User accounts are save in their
own database with usernames and passwords, while posts are kept in a completely
separate database with post title, post body, and user who posted. I keep these
in different collections because the way my program is architected, I only need
one of those collections at a time. However I made sure to keep a common element,
the user to keep my code changeable. This way if I ever need to combine the lists,
I simply need to join the collections into a larger one.

errors simply send users to a page where they are told something went wrong.
This way they know that they need to navigate back to where they were. Also,
errors in login/signup such as incorrect password, incorrect username, etc
keep the user on the same page, but notify them of what error they made in filling
out the form. The same is true when users try to submit invalid posts (more than
200 chars or empty fields).

See github links below:

Here is a link to my realtime error responses for user log in:
https://github.com/6170-fa14/gjvargas_proj2/blob/master/routes/index.js#L24-39

Here I implemented the post text area with character limit.
This allows for maintainable data and easy UX when trying to post.
https://github.com/6170-fa14/gjvargas_proj2/blob/master/views/posts.jade#L13-L18

I used mongo db for persistent data storage for users and posts:
https://github.com/6170-fa14/gjvargas_proj2/blob/master/routes/index.js#L58-81
https://github.com/6170-fa14/gjvargas_proj2/blob/master/routes/index.js#L116-122

Used session variables throughout code to track who/if someone is logged in, and
what errors I might need to display to them during login and sign up.
https://github.com/6170-fa14/gjvargas_proj2/blob/master/routes/index.js#L8-10


Also here's the link to the live app hosted on Openshift:
http://fritter-guva.rhcloud.com/


\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
Final submission
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

So I didn't change much in terms of the aesthetics of the app.

I did however implement search and followers for users who are logged in.
I chose to do it only for logged in users to encourage people to sign up,
and to discourage lurking.

The relevant part of the assignment though, is the data model.

Before the data model looked like this:

User -> Username, Password
Post -> Title, Content, User who posted

This was effective for the simple tasks I had to implement.
This entailed being able to check who is logged in, list
the posts, and compare who posted the content to the current user.
Simple tasks meant a simple data model. This data model was not
rich enough however to implement followers and search, so I had to make
a few changes. This is what it looks like now:

User -> Username, Password, Followees
Post -> Title, Content, User who posted, Words in post

The additional Followees field in user allowed me to split the user experience
into 2 parts: browsing fresh content of users they're not following, and browsing
content posted by the people they are following. This way, users can just read through
the posts of the followers as usual, but they can also look through new posts and
find new people to follow. I accomplish this by filtering all content by comparing
followees to user who posted.

The additional array of words in post allowed me to implement search. Using a little
bit of regex, I parse all posts when they're added/edited and save the words in an
array. Then when a user searches the content they are browsing, I filter the content
so that only posts that match they're search are shown.

Functionally, everything else is the same. All I really did was update the data model
to support these two additional features. That being said, my new github links follow,
but there aren't many more technical additions to be shown off.
