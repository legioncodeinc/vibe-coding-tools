# SPDX: Handling License Info
- URL: https://spdx.dev/learn/handling-license-info/
- Fetched: 2026-09-05
- Source type: official-docs
- Extraction: HTML to text by script; navigation, scripts, and styles dropped; tables flattened with pipes

Handling License Info – SPDX

 Search 

Close Search

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

# Handling License Info

## SPDX License List

The SPDX License List is an integral part of the SPDX Specification. The SPDX License List itself is a list of commonly found licenses and exceptions used in free and open or collaborative software, data, hardware, or documentation. The SPDX License List includes a standardized short identifier, the full name, the license text, and a canonical permanent URL for each license and exception.

The purpose of the SPDX License List is to enable efficient and reliable identification of such licenses and exceptions in an SPDX document, in source files or elsewhere.

SEE LICENSE LIST

## SPDX License IDs

`// SPDX-License-Identifier: MIT`

Use SPDX short-form identifiers to communicate license information in a simple, efficient, portable and machine-readable manner

### What are SPDX IDs?

- An easy way to label your source code’s licenses

- Needs only one new comment line per file

- Human-readable and machine readable

### Why use SPDX IDs?

- Determine easily which licenses apply to a file

- Standardize licenses in source code, docs and others

- Eliminate error-prone parsing of license headers

- Decrease confusion by using the SPDX License List

Read more about why to use SPDX identifiers

### How do SPDX IDs work?

In each file in your project, just add a single line in the following format, tailored to your license(s) and the comment style for that file’s language:

- `// SPDX-License-Identifier: MIT`

- `/* SPDX-License-Identifier: MIT OR Apache-2.0 */`

- `# SPDX-License-Identifier: GPL-2.0-or-later`

Read more about how to use SPDX identifiers

### Where are SPDX IDs used?

SPDX identifiers are being used in a growing number of open source projects (such as the Linux kernel), licensing guidelines (such as the FSFE‘s REUSE Software initiative), and license scanning tools.

See SPDX identifiers in the wild

## SPDX IDs: Why they’re useful

SPDX short-form identifiers make it easier to talk about FOSS licensing.

SPDX IDs are easy to use.

If you can write a comment in a source code file, you can add an SPDX ID.

SPDX IDs are short.

Adding an SPDX ID only requires adding a single `SPDX-License-Identifier:` line.

SPDX IDs are precise.

They’re based on the SPDX License List, a curated set of licenses which helps make sure we’re all talking about the same thing. Saying “a BSD-style license” can mean a wide range of different licenses, some with quite different requirements. Saying “`BSD-3-Clause` ” means one specific license.

SPDX IDs are human-readable and machine-readable.

Gathering license information across your project files can start to become as easy as running grep.

SPDX IDs make code reuse easier.

If your project only has license info in a top-level LICENSE.txt file, it can be harder for others to reuse your code. Downstream recipients may not know what license applies when a file leaves your repo. An SPDX ID is located within each source code or documentation file, and follows that file into downstream projects, making license compliance easier.

SPDX IDs can be adopted gradually.

You can start adding SPDX IDs to new files without changing anything already present in your codebase.

SPDX IDs reduce license errors and risks.

Using SPDX IDs helps convey the meaning of license combinations more specifically and accurately, so that recipients can trust they are complying with your license.

Saying “this file is MPL/MIT” is ambiguous, and leaves recipients unclear about their compliance requirements. Saying `MPL-2.0 AND MIT` or `MPL-2.0 OR MIT `specifies precisely whether the licensee must comply with both licenses, or either license, when redistributing the file.

## SPDX IDs: How to use

### Examples

The examples below are for a language that uses `//` as its comment delimiter.

`// SPDX-License-Identifier: MIT`

The file is under the MIT license.

`// SPDX-License-Identifier: EPL-1.0+`

The file is under the Eclipse Public License version 1.0, or any later version, at the licensee’s option.

`// SPDX-License-Identifier: GPL-2.0-only`

The file is under the GNU General Public License version 2.0.

A special suffix style is used for GNU licenses; see below for details.

`// SPDX-License-Identifier: GPL-2.0-or-later`

The file is under the GNU General Public License version 2.0, or any later version, at the licensee’s option.

A special suffix style is used for GNU licenses; see below for details.

`// SPDX-License-Identifier: Apache-2.0 OR MIT`

The licensee may choose to use the file under either the Apache-2.0 license or the MIT license.

`// SPDX-License-Identifier: Apache-2.0 AND MIT`

The file is subject to both the Apache-2.0 license and the MIT license.

The licensee must comply with both licenses when using the file.

`// SPDX-License-Identifier: Apache-2.0 AND (MIT OR GPL-2.0-only)`

The file is subject to both the Apache-2.0 license, and at the licensee’s choice either the MIT license or version 2.0 only of the GPL.

The licensee may choose between MIT and GPL-2.0. Whichever they choose, they must comply with both that license and Apache-2.0.

`// SPDX-License-Identifier: GPL-3.0-only WITH Classpath-exception-2.0`

The file is subject to version 3.0 only of the GPL. The licensee may also optionally apply the Classpath exception, version 2.0.

Using expressions like these in your source code and documentation is enough to get started. If you’re looking for more details on how IDs work, see below.

### Format

An SPDX short form identifier is a simple way to state the license that applies to a source code or documentation file.

It consists of the following parts on one line:

- [if required] The ‘begin comment’ characters for the applicable programming language (`/*`, `//`, `#`, …)

- The characters `SPDX-License-Identifier:` with whitespace following the colon

- An SPDX license ID (e.g., `Apache-2.0`) or SPDX license expression (see below)

- [if required] The ‘end comment’ characters for the applicable programming language (`*/`, …)

The format for SPDX identifiers is defined in Appendix V of the SPDX specification, version 2.1.

### SPDX License Expressions

The simplest way to express the license for a file is with a single license ID (such as `Apache-2.0` or `GPL-3.0-or-later`) from the SPDX License List.

If 2 or more licenses apply to a file, use an SPDX license expression. It is a composite expression constructed using parentheses, `AND` / `OR` operators, and the `WITH` operator for license exceptions (see below).

Several examples at the top of this page use complex SPDX license expressions. The format for SPDX license expressions is defined in Appendix IV of the SPDX specification, version 2.1.

Some licenses are commonly made subject to certain exceptions. For example, a file can be subject to the GPL version 3.0, but with an additional permission (the “Autoconf Exception version 3.0“) allowing certain propagations of the file’s output as an exception to some of the GPL’s requirements.

A file like this would use the following expression as its short-form identifier:

`// SPDX-License-Identifier: GPL-3.0-only WITH Autoconf-exception-3.0`

The current list of SPDX license exceptions is available here.

### Allowing later versions of a license

Some licensors will permit licensees to use the specified version of a license, or any later version of that license. How to express this depends on whether it is a non-GNU license or a GNU license (such as the GPL, LGPL, AGPL and GFDL).

#### Non-GNU licenses

For non-GNU licenses, just add the `+` operator to the end of the license.

For example, the following expression allows recipients to use the file under the Academic Free License v2.0, or any future version of that license:

`// SPDX-License-Identifier: AFL-2.0+`

#### GNU licenses

For GNU licenses, do not use just the bare license ID, such as “GPL-2.0”.

Instead, always use either the suffix “`-only`“ or the suffix “`-or-later`“ with GNU licenses.

For example, the following expression allows recipients to use the file under the GPL v2.0 only:

`// SPDX-License-Identifier: GPL-2.0-only`

By contrast, the following expression allows recipients to use the file under the GPL v2.0, or any later version of the GPL published by the FSF:

`// SPDX-License-Identifier: GPL-2.0-or-later`

To read more about the reasons for this distinction, please see this article by the FSF.

The SPDX Workgroup is very grateful to the FSF for collaborating with us to develop an identifier format that accommodates the GNU licenses’ approach to license versioning.

### Copyright notices

SPDX IDs are intending to express information about licenses. Copyright notices ‐ statements about who owns the copyright in a file or project ‐ are outside the scope of SPDX short-form IDs.

Therefore, you should not remove or modify existing copyright notices in files when adding an SPDX ID.

## SPDX IDs: Where they're used today

### Projects

A growing number of open source projects are using SPDX short-form identifiers in their code:

- The Linux kernel (LWN article)

- The Zephyr Project (example)

- Several Hyperledger projects, including Hyperledger Fabric and Hyperledger Iroha

- Arm Mbed

- The U-Boot Open Source Project (example)

- NPM packages: spdx-license-ids and spdx

- Tern

- yotta

### Guidelines and Articles

The Free Software Foundation Europe‘s REUSE Software Initiative recommends adding SPDX short-form identifiers to each source code file. Their guidelines also include additional suggestions about, e.g., how to use license identifiers for licenses that are not part of the SPDX License List.

Intel has published a blog post describing the benefits of using SPDX short-form identifiers.

Contact us if your project is using SPDX IDs and you’d like to see it listed here.

Copyright © 2023 The Linux Foundation® . All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our Trademark Usage page. Linux is a registered trademark of Linus Torvalds. Privacy Policy and Terms of Use.

 Close Menu

- About

- Overview

- Governance

- Legal Notices

- Learn

- Overview

- Areas of Interest

- AI

- Build

- Core

- Dataset

- Hardware

- Licensing

- Lite

- Security

- Services

- Software

- Supply Chain

- Handling License Info

- Engage

- Participate

- Technical Team

- Legal Team

- Outreach Team

- Join

- Use

- Overview

- Examples

- Specifications

- License List

- Tools

- News

- Join
