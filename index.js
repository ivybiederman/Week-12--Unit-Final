// Class representing a Blog
class Blog {
    constructor(title, content) {
        this.title = title;
        this.content = content;
    }
}

// Service class for handling CRUD operations on blogs
class BlogService {
    // API endpoint URL for blogs
    static url = 'https://65a0b515600f49256fb02c99.mockapi.io/blogs';

    // Retrieve all blogs from the API
    static getAllBlogs() {
        return $.get(this.url);
    }

    // Retrieve a specific blog by ID from the API
    static getBlog(id) {
        return $.get(`${this.url}/${id}`);
    }

    // Create a new blog entry on the API
    static createBlog(blog) {
        return $.post(this.url, blog);
    }

    // Update an existing blog entry on the API
    static updateBlog(blog) {
        return $.ajax({
            url: `${this.url}/${blog.id}`,
            dataType: 'json',
            data: JSON.stringify(blog),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    // Delete a blog entry by ID from the API
    static deleteBlog(id) {
        return $.ajax({
            url: `${this.url}/${id}`,
            type: 'DELETE'
        });
    }
}

// Class managing the DOM interactions for blogs
class DOMManager {
    // Array to store retrieved blogs
    static blogs;

    // Retrieve all blogs and render them in the DOM
    static getAllBlogs() {
        BlogService.getAllBlogs().then(blogs => this.render(blogs));
    }

    // Create a new blog and display it in the DOM
    static createAndDisplayBlog() {
        const title = $('#new-blog-title').val();
        const content = $('#new-blog-content').val();
        const newBlog = new Blog(title, content);

        BlogService.createBlog(newBlog)
            .then(() => {
                console.log('Blog created successfully!');
                this.getAllBlogs(); // Refresh the list after creation
            })
            .catch(error => {
                console.error('Error creating blog:', error);
            });
    }

    // Delete a blog entry by ID and refresh the list in the DOM
    static deleteBlog(id) {
        BlogService.deleteBlog(id)
            .then(() => {
                console.log(`Deleted blog with ID: ${id}`);
                this.getAllBlogs(); // Refresh the list after deletion
            })
            .catch(error => {
                console.error(`Error deleting blog with ID ${id}:`, error);
            });
    }

    // Render the blogs in the DOM
    static render(blogs) {
        this.blogs = blogs;
        $('#app').empty();
        for (let blog of blogs) {
            // Display each blog entry in a card format
            $('#app').prepend(
                `<div id="${blog.id}" class="card">
                    <div class="card-header">
                        <h2>${blog.title}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteBlog('${blog.id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <p>${blog.content}</p>
                    </div>
                </div><br>`
            );
        }
    }
}

// Execute when the document is ready
$(document).ready(function () {
    // Initialize the DOMManager and retrieve all blogs
    DOMManager.getAllBlogs();

    // Event listener for creating a new blog
    $('#create-new-blog').click(function () {
        DOMManager.createAndDisplayBlog();
    });
});
