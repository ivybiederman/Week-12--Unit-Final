class Blog {
    constructor(title, content) {
        this.title = title;
        this.content = content;
    }
}

class BlogService {
    static url = 'https://65a0b515600f49256fb02c99.mockapi.io/blogs';

    static getAllBlogs() {
        return $.get(this.url);
    }

    static getBlog(id) {
        return $.get(`${this.url}/${id}`);
    }

    static createBlog(blog) {
        return $.post(this.url, blog);
    }

    static updateBlog(blog) {
        return $.ajax({
            url: `${this.url}/${blog.id}`,
            dataType: 'json',
            data: JSON.stringify(blog),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteBlog(id) {
        return $.ajax({
            url: `${this.url}/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static blogs;

    static getAllBlogs() {
        BlogService.getAllBlogs().then(blogs => this.render(blogs));
    }

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

    static render(blogs) {
        this.blogs = blogs;
        $('#app').empty();
        for (let blog of blogs) {
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

$(document).ready(function () {
    DOMManager.getAllBlogs();

    $('#create-new-blog').click(function () {
        DOMManager.createAndDisplayBlog();
    });
});
