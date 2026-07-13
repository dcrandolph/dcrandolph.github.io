---
layout: default
---
{% assign newest_post = site.posts.first %}
<div class="home-custom">
  {% if newest_post %}
    <section class="latest-post-hero">
      <span class="latest-post-date">
        {{ newest_post.date | date: "%d %B %Y" }}
      </span>
      <h2 class="latest-post-title">
        <a href="{{ newest_post.url | relative_url }}">
          {{ newest_post.title | escape }}
        </a>
      </h2>
      <div class="latest-post-excerpt">
        {{ newest_post.content | strip_html | truncatewords: 70 }}
      </div>
      <div class="latest-post-excerpt right">
        <a href="{{ newest_post.url | relative_url }}">
          read more
        </a>
      </div>
    </section>
  {% endif %}
  <section class="post-grid-section">
    <div class="post-grid-container">
      {% assign grid_count = 0 %}
      {% for post in site.posts %}
        {% if post.id == newest_post.id %}{% continue %}{% endif %}
        {% if grid_count >= 3 %}{% break %}{% endif %}
        <article class="grid-post-card">
          <span class="grid-post-date">
            {{ post.date | date: "%d %b %Y" }}
          </span>
          <h3 class="grid-post-title">
            <a href="{{ post.url | relative_url }}">
              {{ post.title | escape }}
            </a>
          </h3>
        </article>
        {% assign grid_count = grid_count | plus: 1 %}
      {% endfor %}
    </div>
  </section>
  <section class="remaining-posts-section">
    <div class="two-column-list-container">
      {% assign total_skipped = 4 %} {% comment %} Skips newest + 3 grid posts {% endcomment %}
      {% for post in site.posts offset: total_skipped %}
        <article class="list-post-item">
          <h4 class="list-post-title">
            <a href="{{ post.url | relative_url }}">
              {{ post.date | date: "%d/%m/%Y" }} - {{ post.title | escape }}
            </a>
          </h4>
        </article>
      {% endfor %}
    </div>
  </section>
</div>
