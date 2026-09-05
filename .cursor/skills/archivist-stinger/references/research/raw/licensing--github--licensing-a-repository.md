# GitHub Docs: Licensing a repository
- URL: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository
- Fetched: 2026-09-05
- Source type: official-docs
- Extraction: HTML to text by script; navigation, scripts, and styles dropped; tables flattened with pipes

Licensing a repository - GitHub Docs

Skip to main content

Collapse sidebarExpand sidebar

Scroll breadcrumbs left

- 

- 

- 

- 

- 

Scroll breadcrumbs right

## 

- 
- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

- 

# Licensing a repository

Public repositories on GitHub are often used to share open source software. For your repository to truly be open source, you'll need to license it so that others are free to use, change, and distribute the software.

Copy as Markdown

## In this article

- 

- 

- 

- 

- 

- 

- 

## Choosing the right license

We created choosealicense.com, to help you understand how to license your code. A software license tells others what they can and can't do with your source code, so it's important to make an informed decision.

You're under no obligation to choose a license. However, without a license, the default copyright laws apply, meaning that you retain all rights to your source code and no one may reproduce, distribute, or create derivative works from your work. If you're creating an open source project, we strongly encourage you to include an open source license. The Open Source Guide provides additional guidance on choosing the correct license for your project.

Note

If you publish your source code in a public repository on GitHub, according to the Terms of Service, other users of GitHub.com have the right to view and fork your repository. If you have already created a repository and no longer want users to have access to the repository, you can make the repository private. When you change the visibility of a repository to private, existing forks or local copies created by other users will still exist. For more information, see Setting repository visibility.

## Determining the location of your license

Most people place their license text in a file named `LICENSE.txt` (or `LICENSE.md` or `LICENSE.rst`) in the root of the repository; here's an example from Hubot.

Some projects include information about their license in their README. For example, a project's README may include a note saying "This project is licensed under the terms of the MIT license."

As a best practice, we encourage you to include the license file with your project.

## Searching GitHub by license type

You can filter repositories based on their license or license family using the `license` qualifier and the exact license keyword.

 | License | License keyword

 | Academic Free License v3.0 | `AFL-3.0`

 | Apache license 2.0 | `Apache-2.0`

 | Artistic license 2.0 | `Artistic-2.0`

 | Boost Software License 1.0 | `BSL-1.0`

 | BSD 2-clause "Simplified" license | `BSD-2-Clause`

 | BSD 3-clause "New" or "Revised" license | `BSD-3-Clause`

 | BSD 3-clause Clear license | `BSD-3-Clause-Clear`

 | BSD 4-clause "Original" or "Old" license | `BSD-4-Clause`

 | BSD Zero-Clause license | `0BSD`

 | Creative Commons license family | `CC`

 | Creative Commons Zero v1.0 Universal | `CC0-1.0`

 | Creative Commons Attribution 4.0 | `CC-BY-4.0`

 | Creative Commons Attribution ShareAlike 4.0 | `CC-BY-SA-4.0`

 | Do What The F*ck You Want To Public License | `WTFPL`

 | Educational Community License v2.0 | `ECL-2.0`

 | Eclipse Public License 1.0 | `EPL-1.0`

 | Eclipse Public License 2.0 | `EPL-2.0`

 | European Union Public License 1.1 | `EUPL-1.1`

 | GNU Affero General Public License v3.0 | `AGPL-3.0`

 | GNU General Public License family | `GPL`

 | GNU General Public License v2.0 | `GPL-2.0`

 | GNU General Public License v3.0 | `GPL-3.0`

 | GNU Lesser General Public License family | `LGPL`

 | GNU Lesser General Public License v2.1 | `LGPL-2.1`

 | GNU Lesser General Public License v3.0 | `LGPL-3.0`

 | ISC | `ISC`

 | LaTeX Project Public License v1.3c | `LPPL-1.3c`

 | Microsoft Public License | `MS-PL`

 | MIT | `MIT`

 | Mozilla Public License 2.0 | `MPL-2.0`

 | Open Software License 3.0 | `OSL-3.0`

 | PostgreSQL License | `PostgreSQL`

 | SIL Open Font License 1.1 | `OFL-1.1`

 | University of Illinois/NCSA Open Source License | `NCSA`

 | The Unlicense | `Unlicense`

 | zLib License | `Zlib`

When you search by a family license, your results will include all licenses in that family. For example, when you use the query `license:gpl`, your results will include repositories licensed under GNU General Public License v2.0 and GNU General Public License v3.0. For more information, see Searching for repositories.

## Detecting a license

The open source Ruby gem Licensee compares the repository's LICENSE file to a short list of known licenses. Licensee also provides the Licenses API and gives us insight into how repositories on GitHub are licensed. If your repository is using a license that isn't listed on the Choose a License website, you can request including the license.

If your repository is using a license that is listed on the Choose a License website and it's not displaying clearly at the top of the repository page, it may contain multiple licenses or other complexity. To have your license detected, simplify your LICENSE file and note the complexity somewhere else, such as your repository's README file.

## Applying a license to a repository with an existing license

The license picker is only available when you create a new project on GitHub.

You can manually add a license using the browser. For more information on adding a license to a repository, see Adding a license to a repository.

## Disclaimer

The goal of GitHub's open source licensing efforts is to provide a starting point to help you make an informed choice. GitHub displays license information to help users get information about open source licenses and the projects that use them. We hope it helps, but please keep in mind that we’re not lawyers and that we make mistakes like everyone else. For that reason, GitHub provides the information on an "as-is" basis and makes no warranties regarding any information or licenses provided on or through it, and disclaims liability for damages resulting from using the license information. If you have any questions regarding the right license for your code or any other legal issues relating to it, it’s always best to consult with a professional.

## Further reading

- The Open Source Guides' section The Legal Side of Open Source

- GitHub Skills

## 

### 

### 

### 

## 

- 

- 

- 

- 

- 

- 

-
