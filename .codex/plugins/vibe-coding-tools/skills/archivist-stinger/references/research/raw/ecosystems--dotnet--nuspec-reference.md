# .nuspec File Reference for NuGet | Microsoft Learn
- URL: https://learn.microsoft.com/en-us/nuget/reference/nuspec
- Fetched: 2026-09-05
- Source type: official-docs

## Overview

A `.nuspec` file is an XML manifest that contains package metadata. This manifest is used both to build the package and to provide information to consumers. The manifest is always included in a package.

### Project type compatibility

- Use `.nuspec` with `nuget.exe pack` for non-SDK-style projects that use `packages.config`.
- A `.nuspec` file is not required to create packages for SDK-style projects (typically .NET Core and .NET Standard projects using the SDK attribute); one is generated when you create the package. If creating a package using `dotnet.exe pack` or the `msbuild pack` target, it's recommended to include all the properties usually in the `.nuspec` file in the project file instead (though a `.nuspec` can still be used with `dotnet.exe`/`msbuild pack`).
- For projects migrated from `packages.config` to `PackageReference`, a `.nuspec` file is not required; use `msbuild -t:pack` instead.

### General form and schema

A `nuspec.xsd` schema file can be found in the NuGet GitHub repository, though no officially published versions exist and no version of that file corresponds to any specific NuGet version.

```xml
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://schemas.microsoft.com/packaging/2010/07/nuspec.xsd">
    <metadata>
        <!-- Required elements-->
        <id></id>
        <version></version>
        <description></description>
        <authors></authors>

        <!-- Optional elements -->
        <!-- ... -->
    </metadata>
    <!-- Optional 'files' node -->
</package>
```

All XML element names in the .nuspec file are case-sensitive (e.g. `<description>` is correct, `<Description>` is not). Important: while the `.nuspec` file references a schema (`xmlns="http://schemas.microsoft.com/packaging/2010/07/nuspec.xsd"`), the NuGet team has never published a schema file usable for automatic schema validation.

### Required metadata elements

These elements must appear within a `<metadata>` element.

#### id

The case-insensitive package identifier, unique across nuget.org or whatever gallery the package resides in. IDs may not contain spaces or characters invalid for a URL, and generally follow .NET namespace rules. When uploading to nuget.org, `id` is limited to 100 characters.

#### version

The version of the package, following the major.minor.patch pattern, with an optional pre-release suffix. When uploading to nuget.org, `version` is limited to 64 characters.

#### description

A description of the package for UI display. When uploading to nuget.org, `description` is limited to 4000 characters.

#### authors

A comma-separated list of package authors. The `authors` and `owners` from the nuspec are ignored when uploading the package to nuget.org. For setting package ownership on nuget.org, see "Managing package owners on nuget.org".

### Optional metadata elements

#### owners

**Important: owners is deprecated. Use authors instead.**

A comma-separated list of package owners. The `owners` from the nuspec is ignored when uploading the package to nuget.org.

#### projectUrl

A URL for the package's home page, often shown in UI displays as well as nuget.org. When uploading to nuget.org, `projectUrl` is limited to 4000 characters.

#### licenseUrl

**Important: licenseUrl is deprecated. Use license instead.**

A URL for the package's license, often shown in UIs like nuget.org. When uploading to nuget.org, `licenseUrl` is limited to 4000 characters.

#### license

*Supported with NuGet 4.9.0 and above.*

An SPDX license expression or path to a license file within the package, often shown in UIs like nuget.org. If licensing under a common license like MIT or BSD-2-Clause, use the associated SPDX license identifier. For example:

```
<license type="expression">MIT</license>
```

Note: NuGet.org only accepts license expressions that are approved by the Open Source Initiative or the Free Software Foundation.

If your package is licensed under multiple common licenses, you can specify a composite license using the SPDX expression syntax version 2.0. For example:

```
<license type="expression">BSD-2-Clause OR MIT</license>
```

If you use a custom license not supported by license expressions, you can package a `.txt` or `.md` file with the license's text. For example:

```xml
<package>
  <metadata>
    ...
    <license type="file">LICENSE.txt</license>
    ...
  </metadata>
  <files>
    ...
    <file src="licenses\LICENSE.txt" target="" />
    ...
  </files>
</package>
```

For the MSBuild equivalent, see "Packing a license expression or a license file".

The exact syntax of NuGet's license expressions is described in ABNF:

```
license-id            = <short form license identifier from https://spdx.org/spdx-specification-21-web-version#h.luq9dgcle9mo>

license-exception-id  = <short form license exception identifier from https://spdx.org/spdx-specification-21-web-version#h.ruv3yl8g6czd>

simple-expression = license-id / license-id"+"

compound-expression =  1*1(simple-expression /
                simple-expression "WITH" license-exception-id /
                compound-expression "AND" compound-expression /
                compound-expression "OR" compound-expression ) /
                "(" compound-expression ")" )

license-expression =  1*1(simple-expression / compound-expression / UNLICENSED)
```

#### iconUrl

**Important: iconUrl is deprecated. Use icon instead.**

A URL for a 128x128 image with transparency background to use as the package icon in UI display; must be a direct image URL, not a web page URL. When uploading to nuget.org, `iconUrl` is limited to 4000 characters.

#### icon

*Supported with NuGet 5.3.0 and above.*

A path to an image file within the package, shown in UIs like nuget.org as the package icon. Image file size limited to 1 MB; supported formats JPEG and PNG; recommended resolution 128x128.

```xml
<package>
  <metadata>
    ...
    <icon>images\icon.png</icon>
    ...
  </metadata>
  <files>
    ...
    <file src="..\icon.png" target="images\" />
    ...
  </files>
</package>
```

Tip: specify both `icon` and `iconUrl` for backward compatibility with clients/sources that don't yet support `icon`.

#### readme

*Supported with NuGet 5.10.0 preview 2 and above.*

Specifies the package path (relative to the package root) of a readme file; the file must also be included in the package. Only Markdown (.md) is supported.

```xml
<package>
  <metadata>
    ...
    <readme>docs\readme.md</readme>
    ...
  </metadata>
  <files>
    ...
    <file src="..\readme.md" target="docs\" />
    ...
  </files>
</package>
```

#### requireLicenseAcceptance

A Boolean specifying whether the client must prompt the consumer to accept the package license before installing.

#### developmentDependency

*(2.8+)* A Boolean specifying whether the package is marked as a development-only-dependency, preventing it from being included as a dependency in other packages. With PackageReference (NuGet 4.8+), also excludes compile-time assets from compilation.

#### summary

**Important: summary is being deprecated. Use description instead.**

A short description for UI display; if omitted, a truncated version of `description` is used. Limited to 4000 characters on nuget.org.

#### releaseNotes

*(1.5+)* A description of the changes made in this release, often shown in the Visual Studio Package Manager's Updates tab. Limited to 35,000 characters on nuget.org.

#### copyright

*(1.5+)* Copyright details for the package. Limited to 4000 characters on nuget.org.

#### language

The locale ID for the package.

#### tags

A space-delimited list of tags and keywords describing the package, aiding discoverability. Limited to 4000 characters on nuget.org.

#### serviceable

*(3.3+)* For internal NuGet use only.

#### repository

Repository metadata, consisting of four optional attributes: `type` and `url` *(4.0+)*, and `branch` and `commit` *(4.6+)*. These attributes map the `.nupkg` to the repository that built it, potentially down to the branch name and/or commit SHA-1 hash. This should be a publicly available URL that can be invoked directly by version control software, not an HTML project page (use `projectUrl` for that).

For example:

```xml
<?xml version="1.0"?>
<package xmlns="http://schemas.microsoft.com/packaging/2010/07/nuspec.xsd">
    <metadata>
        ...
        <repository type="git" url="https://github.com/NuGet/NuGet.Client.git" branch="dev" commit="e1c65e4524cd70ee6e22abe33e6cb6ec73938cb3" />
        ...
    </metadata>
</package>
```

When uploading to nuget.org, the `type` attribute is limited to 100 characters and `url` is limited to 4000 characters.

#### title

A human-friendly title of the package which may be used in some UI displays (nuget.org and the Visual Studio Package Manager do not show title). Limited to 256 characters on nuget.org but not used for display purposes there.

### Collection elements (names and brief description)

- **packageTypes** *(3.5+)*: zero or more `<packageType>` elements specifying the package type if other than a traditional dependency package (attributes: name, version).
- **dependencies**: zero or more `<dependency>` elements specifying package dependencies (attributes: id, version, include, exclude).
- **frameworkAssemblies** *(1.2+)*: zero or more `<frameworkAssembly>` elements identifying required .NET Framework assembly references (attributes: assemblyName, targetFramework).
- **references** *(1.5+)*: zero or more `<reference>` elements naming assemblies in the package's `lib` folder added as project references (attribute: file); can contain `<group>` elements keyed by targetFramework.
- **contentFiles** *(3.3+)*: a collection of `<files>` elements identifying content files to include in the consuming project (attributes: include, exclude, buildAction, copyToOutput, flatten).
- **files**: the `<package>` node may contain a `<files>` node (sibling of `<metadata>`) specifying which assembly and content files to include.

### metadata attributes

#### minClientVersion

Specifies the minimum NuGet client version required to install the package, enforced by nuget.exe and the Visual Studio Package Manager.

```xml
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://schemas.microsoft.com/packaging/2010/07/nuspec.xsd">
    <metadata minClientVersion="100.0.0.1">
        <id>dasdas</id>
        <version>2.0.0</version>
        <title />
        <authors>dsadas</authors>
        <owners />
        <requireLicenseAcceptance>false</requireLicenseAcceptance>
        <description>My package description.</description>
    </metadata>
    <files>
        <file src="content\one.txt" target="content\one.txt" />
    </files>
</package>
```

## Example nuspec files (from the page)

**A simple `.nuspec` that does not specify dependencies or files**

```xml
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://schemas.microsoft.com/packaging/2010/07/nuspec.xsd">
    <metadata>
        <id>sample</id>
        <version>1.2.3</version>
        <authors>Kim Abercrombie, Franck Halmaert</authors>
        <description>Sample exists only to show a sample .nuspec file.</description>
        <language>en-US</language>
        <projectUrl>http://xunit.codeplex.com/</projectUrl>
        <license type="expression">MIT</license>
    </metadata>
</package>
```

**A `.nuspec` with dependencies**

```xml
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://schemas.microsoft.com/packaging/2010/07/nuspec.xsd">
    <metadata>
        <id>sample</id>
        <version>1.0.0</version>
        <authors>Microsoft</authors>
        <dependencies>
            <dependency id="another-package" version="3.0.0" />
            <dependency id="yet-another-package" version="1.0.0" />
        </dependencies>
    </metadata>
</package>
```

(Two further examples on the page -- "A .nuspec with files" and "A .nuspec with framework assemblies" -- are omitted here; see Omitted sections.)

## Other page sections documented (names only)

Replacement tokens (for use with a Visual Studio project via `nuget pack -properties`), Dependencies element (attributes id/version/include/exclude, dependency groups), Explicit assembly references (references element, reference groups), Framework assembly references, Including assembly files (file element attributes src/target/exclude, multiple worked examples), Including content files (files element vs. contentFiles element, package folder structure under /contentFiles/{codeLanguage}/{TxM}/{any?}), Framework reference groups (5.1+, PackageReference only).

## Omitted sections

The detailed worked examples under "Replacement tokens" (the full token table and nuget pack -properties walkthrough), "Dependencies element" (dependency groups syntax and the include/exclude tag-to-folder table), "Explicit assembly references" and "Reference groups", "Framework assembly references" example, the full "Including assembly files" and "Including content files" example galleries (single assembly, wildcard sets, exclusions, contentFiles folder-structure conventions), "Framework reference groups", and two of the four "Example nuspec files" (the files-only and framework-assemblies examples) were omitted from verbatim capture because they are packaging/build/dependency-resolution mechanics rather than identity, attribution, license, repository, homepage, or contact metadata. Their names and one-line descriptions are listed above for completeness.
