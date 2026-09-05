# Specification Reference - RubyGems Guides
- URL: https://guides.rubygems.org/specification-reference/
- Fetched: 2026-09-05
- Source type: official-docs

## Overview

The Specification class contains the information for a gem. Typically defined in a .gemspec file or a Rakefile, and looks like this:

```ruby
Gem::Specification.new do |s|
  s.name        = 'example'
  s.version     = '0.1.0'
  s.licenses    = ['MIT']
  s.summary     = "This is an example!"
  s.description = "Much longer explanation of the example!"
  s.authors     = ["Ruby Coder"]
  s.email       = 'rubycoder@example.com'
  s.files       = ["lib/example.rb"]
  s.homepage    = 'https://rubygems.org/gems/example'
  s.metadata    = { "source_code_uri" => "https://github.com/example/example" }
end
```

Starting in RubyGems 2.0, a Specification can hold arbitrary metadata. See metadata (below) for restrictions on the format and size of metadata items you may add to a specification.

Specifications must be deterministic -- attributes cannot be defined conditionally, e.g.:

```ruby
# INVALID: do not do this.
unless RUBY_ENGINE == "jruby"
  s.extensions << "ext/example/extconf.rb"
end
```

The page groups attributes into four categories (each with its own heading and attribute list): "Required gemspec attributes", "Recommended gemspec attributes", "Read-only attributes", and "Optional gemspec attributes".

## name

This gem's name.

Usage:

```ruby
spec.name = 'rake'
```

## summary

A short summary of this gem's description. Displayed in `gem list -d`. The description should be more detailed than the summary.

Usage:

```ruby
spec.summary = "This is a small summary of my gem"
```

## description

A long description of this gem. The description should be more detailed than the summary but not excessively long. A few paragraphs is a recommended length with no examples or formatting.

Usage:

```ruby
spec.description = <<~EOF
  Rake is a Make-like program implemented in Ruby. Tasks and
  dependencies are specified in standard Ruby syntax.
EOF
```

## authors=(value)

A list of authors for this gem.

Alternatively, a single author can be specified by assigning a string to `spec.author`.

Usage:

```ruby
spec.authors = ['John Jones', 'Mary Smith']
```

## author=(o)

Singular (alternative) writer for authors.

Usage:

```ruby
spec.author = 'John Jones'
```

## email

A contact email address (or addresses) for this gem.

Usage:

```ruby
spec.email = 'john.jones@example.com'
spec.email = ['jack@example.com', 'jill@example.com']
```

## homepage

The URL of this gem's home page.

Usage:

```ruby
spec.homepage = 'https://github.com/ruby/rake'
```

## license=(o)

The license for this gem.

The license must be no more than 64 characters, and should be a single SPDX license identifier from spdx.org/licenses/. Ideally, you should pick one that is OSI (Open Source Initiative) opensource.org/licenses/ approved.

The most commonly used OSI-approved licenses are MIT and Apache-2.0. GitHub also provides a license picker at choosealicense.com/.

The full text of the license should be inside of the gem (at the top level) when you build it.

RubyGems validates the license against the SPDX license list when you run `gem build` and warns about unknown or deprecated identifiers. An identifier may carry a trailing `+` (this version or any later version) and a license exception joined with `WITH`, for example `Apache-2.0 WITH LLVM-exception`.

Compound SPDX license expressions such as `MIT OR Apache-2.0` are not currently supported. RubyGems treats the whole string as a single identifier and warns that it is invalid. For a gem available under more than one license, set each license as a separate entry with `licenses=`.

For a license that has no SPDX identifier, use `Nonstandard`, or `LicenseRef-<idstring>` where idstring is the name of the file containing the license text.

You should specify a license for your gem so that people know how they are permitted to use it and any restrictions you're placing on it. Not specifying a license means all rights are reserved; others have no right to use the code for any purpose.

Usage:

```ruby
spec.license = 'MIT'
```

## licenses=(licenses)

The license(s) for the library.

Each entry must be a single SPDX license identifier, no more than 64 characters. Entries are validated independently, so a compound expression such as `MIT OR Apache-2.0` is not valid as an entry. Listing the identifiers as separate array elements is currently the only way RubyGems supports declaring a dual- or multi-licensed gem.

Note that the array itself does not state how the licenses combine. Include the full text of each license in the gem and describe the exact terms there.

See license= for more discussion.

Usage:

```ruby
spec.licenses = ['MIT', 'GPL-2.0-only']
```

## metadata

The metadata holds extra data for this gem that may be useful to other consumers and is settable by gem authors.

Metadata items have the following restrictions:

- The metadata must be a Hash object
- All keys and values must be Strings
- Keys can be a maximum of 128 bytes and values can be a maximum of 1024 bytes
- All strings must be UTF-8, no binary data is allowed

You can use metadata to specify links to your gem's homepage, codebase, documentation, wiki, mailing list, issue tracker and changelog.

```ruby
s.metadata = {
  "bug_tracker_uri"   => "https://example.com/user/bestgemever/issues",
  "changelog_uri"     => "https://example.com/user/bestgemever/CHANGELOG.md",
  "documentation_uri" => "https://www.example.info/gems/bestgemever/0.0.1",
  "homepage_uri"      => "https://bestgemever.example.io",
  "mailing_list_uri"  => "https://groups.example.com/bestgemever",
  "source_code_uri"   => "https://example.com/user/bestgemever",
  "wiki_uri"          => "https://example.com/user/bestgemever/wiki",
  "funding_uri"       => "https://example.com/donate"
}
```

These links will be used on your gem's page on rubygems.org and must pass validation against the following regex:

```
%r{\Ahttps?:\/\/([^\s:@]+:[^\s:@]*@)?[A-Za-z\d\-]+(\.[A-Za-z\d\-]+)+\.?(:\d{1,5})?([\/?]\S*)?\z}
```

## Other gemspec attributes documented on the page (names only, grouped as the page groups them)

- **Required gemspec attributes**: authors=(value), files, name, summary, version
- **Recommended gemspec attributes**: description, email, homepage, license=(o), licenses=(licenses), metadata, required_ruby_version
- **Read-only attributes**: extensions_dir, rubygems_version
- **Optional gemspec attributes**: add_dependency(gem, *requirements), add_development_dependency(gem, *requirements), author=(o), bindir, cert_chain, executables, extensions, extra_rdoc_files, platform=(platform), post_install_message, rdoc_options, require_paths=(val), required_ruby_version=(req), required_rubygems_version, required_rubygems_version=(req), requirements, signing_key

## Omitted sections

This capture includes name, summary, description (kept as immediate context for the identity/attribution cluster) plus full verbatim text for authors=, author=, email, homepage, license=, licenses=, and metadata. The remaining attributes listed above (files, version, required_ruby_version, extensions_dir, rubygems_version, add_dependency, add_development_dependency, bindir, cert_chain, executables, extensions, extra_rdoc_files, platform=, post_install_message, rdoc_options, require_paths=, required_ruby_version=, required_rubygems_version, required_rubygems_version=, requirements, signing_key) were omitted from verbatim capture as build/packaging/signing mechanics unrelated to identity, attribution, license, homepage, or contact/funding metadata. The page's left-hand sidebar navigation (Getting Started, Guides, Concepts, Reference, Appendix link trees) was omitted as site navigation and boilerplate.
