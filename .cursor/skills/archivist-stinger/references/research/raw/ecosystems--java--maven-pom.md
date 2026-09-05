# POM Reference - Maven
- URL: https://maven.apache.org/pom.html
- Fetched: 2026-09-05
- Source type: official-docs

## What is the POM?

POM stands for "Project Object Model". It is an XML representation of a Maven project held in a file named pom.xml. A project contains configuration files, as well as the developers involved and the roles they play, the defect tracking system, the organization and licenses, the URL of where the project lives, the project's dependencies, and all the other little pieces that come into play to give code life.

## Quick Overview (top-level elements under <project>)

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <!-- The Basics -->
  <groupId>...</groupId>
  <artifactId>...</artifactId>
  <version>...</version>
  <packaging>...</packaging>
  <dependencies>...</dependencies>
  <parent>...</parent>
  <dependencyManagement>...</dependencyManagement>
  <modules>...</modules>
  <properties>...</properties>
  <!-- Build Settings -->
  <build>...</build>
  <reporting>...</reporting>
  <!-- More Project Information -->
  <name>...</name>
  <description>...</description>
  <url>...</url>
  <inceptionYear>...</inceptionYear>
  <licenses>...</licenses>
  <organization>...</organization>
  <developers>...</developers>
  <contributors>...</contributors>
  <!-- Environment Settings -->
  <issueManagement>...</issueManagement>
  <ciManagement>...</ciManagement>
  <mailingLists>...</mailingLists>
  <scm>...</scm>
  <prerequisites>...</prerequisites>
  <repositories>...</repositories>
  <pluginRepositories>...</pluginRepositories>
  <distributionManagement>...</distributionManagement>
  <profiles>...</profiles>
</project>
```

## More Project Information (section intro)

Several elements do not affect the build, but rather document the project for the convenience of developers. Many of these elements are used to fill in project details when generating the project's website. However, like all POM declarations, plugins can use them for anything. The simplest elements:

- `<name>`: Projects tend to have conversational names, beyond the artifactId. The Sun engineers did not refer to their project as "java-1.5", but rather just called it "Tiger". Here is where to set that value.
- `<description>`: A short, human-readable description of the project. Although this should not replace formal documentation, a quick comment to any readers of the POM is always helpful.
- `<url>`: The project's home page.
- `<inceptionYear>`: The year the project was first created.

## Licenses

```xml
<licenses>
  <license>
    <name>Apache-2.0</name>
    <url>https://www.apache.org/licenses/LICENSE-2.0.txt</url>
    <distribution>repo</distribution>
    <comments>A business-friendly OSS license</comments>
  </license>
</licenses>
```

Licenses are legal documents defining how and when a project (or parts of a project) may be used. A project should list licenses that apply directly to this project, and not list licenses that apply to the project's dependencies.

`<name>`, `<url>` and `<comments>`: are self-explanatory, and have been encountered before in other contexts. Using an SPDX identifier (https://spdx.org/licenses/) as the license `<name>` is recommended.

`<distribution>`: This describes how the project may be legally distributed. The two stated methods are `repo` (they may be downloaded from a Maven repository) or `manual` (they must be manually installed).

## Organization

Most projects are run by some sort of organization (business, private group, etc.). Here is where the most basic information is set.

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0">
  ...
  <organization>
    <name>Mojohaus</name>
    <url>http://www.mojohaus.org</url>
  </organization>
</project>
```

## Developers

All projects consist of files that were created, at some time, by a person. Developers are presumably members of the project's core development. Note that, although an organization may have many developers (programmers) as members, it is not good form to list them all as developers, but only those who are immediately responsible for the code. A good rule of thumb is, if the person should not be contacted about the project, they do not need to be listed here.

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0">
  ...
  <developers>
    <developer>
      <id>jdoe</id>
      <name>John Doe</name>
      <email>jdoe@example.com</email>
      <url>http://www.example.com/jdoe</url>
      <organization>ACME</organization>
      <organizationUrl>http://www.example.com</organizationUrl>
      <roles>
        <role>architect</role>
        <role>developer</role>
      </roles>
      <timezone>America/New_York</timezone>
      <properties>
        <picUrl>http://www.example.com/jdoe/pic</picUrl>
      </properties>
    </developer>
  </developers>
  ...
</project>
```

- `<id>`, `<name>`, `<email>`: These correspond to the developer's ID (presumably some unique ID across an organization), the developer's name and email address.
- `<organization>`, `<organizationUrl>`: the developer's organization name and its URL, respectively.
- `<roles>`: A role should specify the standard actions that the person is responsible for. A single person can take on multiple roles.
- `<timezone>`: A valid time zone ID like America/New_York or Europe/Berlin, or a numerical offset in hours (and fraction) from UTC where the developer lives, e.g., -5 or +1. Time zone IDs are highly preferred because they are not affected by DST and time zone shifts.
- `<properties>`: This element is where any other properties about the person goes -- for example, a link to a personal image or an instant messenger handle.

## Contributors

Contributors are like developers yet play an ancillary role in a project's lifecycle. Perhaps the contributor sent in a bug fix, or added some important documentation. A healthy open source project will likely have more contributors than developers.

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0">
  ...
  <contributors>
    <contributor>
      <name>Noelle</name>
      <email>some.name@gmail.com</email>
      <url>http://noellemarie.com</url>
      <organization>Noelle Marie</organization>
      <organizationUrl>http://noellemarie.com</organizationUrl>
      <roles>
        <role>tester</role>
      </roles>
      <timezone>America/Vancouver</timezone>
      <properties>
        <gtalk>some.name@gmail.com</gtalk>
      </properties>
    </contributor>
  </contributors>
  ...
</project>
```

Contributors contain the same set of elements as developers, minus the `id` element.

## Issue Management

This defines the defect tracking system (Bugzilla, TestTrack, ClearQuest, etc.) used. Although there is nothing stopping a plugin from using this information for something, it's primarily used for generating project documentation.

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0">
  ...
  <issueManagement>
    <system>Bugzilla</system>
    <url>http://127.0.0.1/bugzilla/</url>
  </issueManagement>
  ...
</project>
```

## SCM

SCM (Software Configuration Management, also called Source Code/Control Management or, succinctly, version control) is an integral part of any healthy project.

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0">
  ...
  <scm>
    <connection>scm:svn:http://127.0.0.1/svn/my-project</connection>
    <developerConnection>scm:svn:https://127.0.0.1/svn/my-project</developerConnection>
    <tag>HEAD</tag>
    <url>http://127.0.0.1/websvn/my-project</url>
  </scm>
  ...
</project>
```

`<connection>`, `<developerConnection>`: The two connection elements convey how one is to connect to the version control system through Maven. `connection` requires read access for Maven to find the source code (e.g. for an update); `developerConnection` requires a connection that gives write access. All SCM connections are made through a common URL structure: `scm:[provider]:[provider_specific]`. For example, connecting to a CVS repository may look like: `scm:cvs:pserver:127.0.0.1:/cvs/root:my-project`.

`<tag>`: Specifies the tag that this project lives under. HEAD (the SCM root) is the default.

`<url>`: A publicly browsable repository, e.g. via ViewCVS.

## Other top-level POM elements documented on this page (names only)

modelVersion, groupId, artifactId, version, packaging, dependencies (and dependencyManagement, exclusions, scope, classifier, type, optional, version-requirement-specification syntax, version-order rules), parent/inheritance (including the Super POM), modules (aggregation/multi-module), properties, build (defaultGoal, directory, finalName, filters, resources/testResources, plugins with extensions/inherited/configuration/dependencies/executions, plugin configuration inheritance including combine.children / combine.self), reporting, ciManagement, mailingLists, prerequisites, repositories, pluginRepositories, distributionManagement (repository, site distribution, relocation, downloadUrl, status), profiles.

## Omitted sections

This capture focuses on the "More Project Information" cluster (name/description/url/inceptionYear as intro context) plus the full verbatim text of licenses, organization, developers, contributors, issueManagement, and scm, since those are the identity/attribution/license/repository/contact-relevant elements. The much larger remainder of the page -- Maven Coordinates, Packaging, POM Relationships/Dependencies (including the full dependency version requirement and version ordering specifications, exclusions), Inheritance and the Super POM listing, Dependency Management, Aggregation, Properties, Build Settings (the BaseBuild element set, Resources, Plugins, Plugin Management, plugin configuration inheritance mechanics, Directories, Extensions), Reporting/Report Sets, ciManagement, mailingLists, prerequisites, repositories/pluginRepositories, distributionManagement (repository, site distribution, relocation, downloadUrl, status), and profiles -- were omitted from verbatim capture as build/dependency/lifecycle mechanics unrelated to identity, attribution, license, repository, homepage, funding, bug-tracker, or contact fields. Their section names are listed above for completeness.
