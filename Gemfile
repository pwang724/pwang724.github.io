# frozen_string_literal: true

source "https://rubygems.org"
gemspec

gem 'jekyll', '3.6.3'

group :jekyll_plugins do
  gem 'jekyll-archives'
end

plugins:
  - jekyll-archives

if ENV["GH_PAGES"]
  gem "github-pages"
elsif ENV["JEKYLL_VERSION"]
  gem "jekyll", "~> #{ENV["JEKYLL_VERSION"]}"
end
