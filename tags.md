---
layout: page
title: Tags
permalink: /tags/
---
{% assign min_count = 9999 %}
{% assign max_count = 0 %}

{% for tag in site.tags %}
  {% assign current_size = tag[1].size %}
  {% if current_size < min_count %}{% assign min_count = current_size %}{% endif %}
  {% if current_size > max_count %}{% assign max_count = current_size %}{% endif %}
{% endfor %}

{% assign total_range = max_count | minus: min_count %}

<!-- 1. Dynamic Tag Cloud -->
<div class="tag-cloud" style="display: flex; flex-wrap: wrap; align-items: center; gap: 15px; margin-bottom: 30px;">
  {% assign sorted_tags = site.tags | sort %}
  {% for tag in sorted_tags %}
    {% assign tag_name = tag | first %}
    {% assign tag_posts = tag | last %}
    {% assign count = tag_posts.size %}
    
    {% if total_range == 0 %}
      {% assign font_size = 100 %}
    {% else %}
      {% assign numeric_fraction = count | minus: min_count | times: 110 %}
      {% assign size_offset = numeric_fraction | divided_by: total_range %}
      {% assign font_size = 90 | plus: size_offset %}
    {% endif %}

    <a href="#{{ tag_name | slugify }}" class="tag-link" style="font-size: {{ font_size }}%; line-height: 1.2;">
      {{ tag_name }}
    </a>
  {% endfor %}
</div>

-------

<div class="tag-sections">
  {% for tag in sorted_tags %}
    {% assign tag_name = tag | first %}
    {% assign tag_posts = tag | last %}
    
    <div id="{{ tag_name | slugify }}" class="tag-group">
      <h3>#{{ tag_name }}</h3>
      <ul>
        {% assign reversed_posts = tag_posts | reverse %}
        {% for post in reversed_posts %}
          <li>
            <!-- <span class="post-date">{{ post.date | date: "%b %d, %Y" }}</span> —  -->
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </li>
        {% endfor %}
      </ul>
    </div>
  {% endfor %}
</div>
