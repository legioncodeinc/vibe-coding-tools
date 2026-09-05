# Guidelines 01/2025 on Pseudonymisation
- URL: https://www.edpb.europa.eu/our-work-tools/documents/public-consultations/2025/guidelines-012025-pseudonymisation_en (landing page carries only metadata; substantive text fetched from the linked PDF, alternate: https://www.edpb.europa.eu/system/files/2025-01/edpb_guidelines_202501_pseudonymisation_en.pdf)
- Fetched: 2026-09-05
- Source type: official-spec

## Note on the landing page vs. the PDF

The requested landing page (https://www.edpb.europa.eu/our-work-tools/documents/public-consultations/2025/guidelines-012025-pseudonymisation_en) contains only metadata: the guidelines' reference number (01/2025), the feedback period (17 January to 14 March 2025), links to two downloadable PDFs ("Guidelines 01/2025 on Pseudonymisation", 885.25 KB, and a companion "Summary: pseudonymisation, when and how to apply it", 3.93 MB), and a table of organisations that submitted feedback. It carries none of the guidelines' actual text. The substantive content below, including the executive summary and the definitions section, was fetched directly from the first linked PDF (the alternate URL given for this source), adopted 16 January 2025.

## EXECUTIVE SUMMARY

The GDPR defines the term 'pseudonymisation' for the first time in EU law and refers to it several times as a safeguard that may be appropriate and effective for the fulfilment of certain data protection obligations.

As per that definition, pseudonymisation can reduce the risks to the data subjects by preventing the attribution of personal data to natural persons in the course of the processing of the data, and in the event of unauthorised access or use.

Applying pseudonymisation, controllers can thus retain the option to analyse the data, and, optionally, to merge different records relating to the same person. Pseudonymisation can also and often will be set up so that it is possible to revert to the original data. Thus, controllers can process personal data in original form in some stages of the processing, and in pseudonymised form in others.

Pseudonymised data, which could be attributed to a natural person by the use of additional information, is to be considered information on an identifiable natural person, and is therefore personal. This statement also holds true if pseudonymised data and additional information are not in the hands of the same person. Even if all additional information retained by the pseudonymising controller has been erased, the pseudonymised data can be considered anonymous only if the conditions for anonymity are met.

The GDPR does not impose a general obligation to use pseudonymisation. The explicit introduction of pseudonymisation is not intended to preclude any other measures of data protection (Rec. 28 GDPR). It is the responsibility of the controller to decide on the choice of means for meeting its obligations having regard to the accountability principle. Depending on the nature, scope, context and purposes of processing, and the risks involved in it, controllers may need to apply pseudonymisation in order to meet the requirements of EU data protection law, in particular in order to adhere to the data minimisation principle, to implement data protection by design and by default, or to ensure a level of security appropriate to the risk. In some specific situations, Union or Member State law may mandate pseudonymisation.

The risk reduction resulting from pseudonymisation may enable controllers to rely on legitimate interests under Art. 6(1)(f) GDPR as the legal basis for their processing provided they meet the other requirements of that subparagraph; contribute to establishing compatibility of further processing according to Art. 6(4) GDPR; or help guarantee an essentially equivalent level of protection for data they intend to export.

Finally, the contribution of pseudonymisation to data protection by design and default, and the assurance of a level of security appropriate to risk may make other measures redundant, even though pseudonymisation alone will normally not be a sufficient measure for either.

Controllers should establish and precisely define the risks they intend to address with pseudonymisation. The intended reduction of those risks constitutes the objective of pseudonymisation within the concrete processing activity. Controllers should shape pseudonymisation in a way that guarantees that it is effective in reaching this objective.

Controllers may define the context in which pseudonymisation is to preclude attribution of data to specific data subjects. This context will be called the pseudonymisation domain in these guidelines. The pseudonymisation domain does not have to be all-encompassing, but may be restricted to defined entities, most often to the set of all authorised recipients of the personal data that will process the data for a given purpose. The effectiveness of pseudonymisation in the implementation of data protection principles or in the assurance of a level of security appropriate to the risk is highly dependent on the choice of the pseudonymisation domain and its isolation from additional information that allows the attribution of pseudonymised data to specific individuals.

Thus, pseudonymisation is a safeguard that can be applied by controllers to meet the requirements of data protection law and, in particular, to demonstrate compliance with the data protection principles in accordance with Art 5(2) GDPR. These guidelines will help controllers to choose effective techniques for the modification of original data, to protect pseudonymised data from unauthorised attribution, and to manage user rights when processing pseudonymised data.

Controllers must always bear in mind that pseudonymised data, which could be attributed to a natural person by the use of additional information, remains information related to an identifiable natural person, and thus is personal data (Rec. 26 GDPR). Therefore, the processing of such data needs to comply with the GDPR, including the principles of lawfulness, transparency, and confidentiality under Art. 5 GDPR, and the requirements of Art. 6 GDPR. Controllers must maintain an appropriate level of security by implementing further technical and organisational measures. Finally, controllers must ensure transparency, and need to facilitate the exercise of the data subject rights set out in Chapter III of the GDPR, unless the exception provided for in Art. 11(2) and 12(2) GDPR applies.

## Table of Contents (as printed in the PDF)

Executive summary ... 3
1 Introduction ... 7
2 Definitions and legal analysis ... 9
2.1 Legal definition of pseudonymisation ... 9
2.2 Objectives and advantages of pseudonymisation ... 10
2.3 Pseudonymisation domain and available means for attribution ... 12
2.4 Meeting data-protection requirements using pseudonymisation ... 13
2.5 Transmission of pseudonymised data to third parties ... 17
2.6 Implications for the rights of the data subjects ... 19
2.7 Unauthorised reversal of pseudonymisation ... 19
3 Technical measures and safeguards for pseudonymisation ... 20
Annex - Examples of the Application of Pseudonymisation ... 31
Glossary ... 45

## 1 INTRODUCTION (selected paragraphs)

1. These guidelines intend to clarify the use and benefits of pseudonymisation for controllers and processors.

2. The GDPR defines the term 'pseudonymisation' for the first time in EU law and refers to it several times as a safeguard that may be appropriate and effective for the fulfilment of data protection obligations.

3. Art. 4(5) GDPR defines pseudonymisation as a manner of processing with prescribed effects and calls for certain measures by which those effects are to be achieved.

4. The desired effect of pseudonymisation is to control the attribution of personal data to specific data subjects by denying this ability to some persons or parties. The GDPR does not specify who those persons or parties are to be, leaving it, absent specific requirements by other EU or Member State law, to the controller's decision.

5. There are three actions controllers should take to achieve the desired effect. First, they need to modify or transform the data. Second, they need to keep additional information for attributing the personal data to a specific data subject separately, i.e. separate from those who are to be prevented from achieving such an attribution. Last, they need to apply technical and organisational measures to ensure that the personal data are not attributed to an identified or identifiable natural person.

6. Pseudonymisation as a technical measure for the protection of the privacy of individuals has been around for a long time. The common understanding of pseudonymisation involves the replacement of identifiers of individuals by pseudonyms, chosen so that they do not reveal the identity of the individual they are assigned to. The legal definition presented by the GDPR differs from that understanding in three significant ways.

7. First, the legal definition takes a more comprehensive view of the effect of pseudonymisation. It shall no longer be possible to attribute the personal data to a specific data subject without the use of additional information. This requires a look at all parts of the personal data, not only the pseudonyms.

8. Second, it does not even explicitly require the replacement of direct identifiers by pseudonyms. Art. 4(5) GDPR provides for the retention of additional information that allows attribution of the data to individuals; during attribution, a link will be made between the data (or parts thereof) and identifiers of the individuals.

9. Third, it requires more than just the transformation of data. It requires additional technical and organisational measures to ensure that the personal data are not attributed to an identified or identifiable natural person, typically limiting access to the retained additional information (e.g. keys or tables of pseudonyms) and controlling the flow of pseudonymised data.

## 2 DEFINITIONS AND LEGAL ANALYSIS

### 2.1 Legal definition of pseudonymisation

16. Pseudonymisation is defined in Art. 4(5) GDPR as "the processing of personal data in such a manner that the personal data can no longer be attributed to a specific data subject without the use of additional information, provided that such additional information is kept separately and is subject to technical and organisational measures to ensure that the personal data are not attributed to an identified or identifiable natural person."

17. To attribute data to a specific (identified) person means to establish that the data relate to that person. To attribute data to an identifiable person means to link the data to other information with reference to which the natural person could be identified. Such a link could be established on the basis of one or several identifiers or identifying attributes.

18. Pseudonymisation generally requires the application of a pseudonymising transformation. This is a procedure that modifies original data in a way that the result, the pseudonymised data, cannot be attributed to a specific data subject without additional information. The pseudonymising transformation may and regularly does replace part of the original data with one or several pseudonyms, new identifiers that can be attributed to data subjects only using additional information. These guidelines call controllers that use pseudonymisation as a safeguard and modify original data according to Art. 4(5) GDPR "pseudonymising controllers."

19. Additional information is information whose use enables the attribution of pseudonymised data to identified or identifiable persons. The generation, or use, of additional information is an inherent part of the pseudonymising transformation.

20. It includes information that is retained as part of the pseudonymisation process for consistent pseudonymisation of different items of personal data relating to the same data subject, and information kept to be used for later reversal of pseudonymisation. Such additional information may consist of tables matching pseudonyms with the identifying attributes they replace, or of cryptographic keys. Additional information kept by a pseudonymising controller or processor must be subject to technical and organisational measures to ensure that the personal data are not attributed to an identified or identifiable natural person; in particular, the additional information is not to be disclosed to or used by persons processing the pseudonymised data. Such additional information may itself be personal data and so also subject to the GDPR.

21. Additional information may also exist beyond the immediate control of the pseudonymising controller or processor (for example, information from publicly accessible sources such as social media or an online forum). The pseudonymising controller or processor should take such information into account when assessing the effectiveness of pseudonymisation, to the extent it can reasonably be expected to be available.

22. **Pseudonymised data, which could be attributed to a natural person by the use of additional information, is to be considered information on an identifiable natural person, and is therefore personal.** This statement also holds true if pseudonymised data and additional information are not in the hands of the same person. If pseudonymised data and additional information could be combined having regard to the means reasonably likely to be used by the controller or by another person, then the pseudonymised data is personal. Even if all additional information retained by the pseudonymising controller has been erased, the pseudonymised data becomes anonymous only if the conditions for anonymity are met.

23. Pseudonymisation is a technical and organisational measure that allows controllers and processors to reduce the risks to data subjects and meet their data-protection obligations, for example under Art. 25 or 32 GDPR.

24. Union or Member State law may require pseudonymisation of personal data for the processing of personal data in specific situations, e.g. when providing for a legal basis under Art. 6(1)(c) or (e) GDPR in accordance with Art. 6(3) GDPR, or as a further condition in accordance with Art. 9(4) GDPR.

25. When such specific mandates for pseudonymisation are absent, controllers themselves may define the objectives that pseudonymisation should achieve.

### 2.2 Objectives and advantages of pseudonymisation

26. In accordance with Rec. 28 GDPR, pseudonymising data reduces risks for data subjects while allowing general analysis.

#### 2.2.1 Risk reduction

27. Pseudonymisation reduces confidentiality risks when done effectively, which presumes that the additional information referred to in paragraph 20 is subject to the measures provided in Art. 4(5) GDPR. It does so in two ways: first, it prevents the disclosure of direct identifiers of data subjects to some or all legitimate recipients of the pseudonymised data; second, in the event of unauthorized disclosure or access to effectively pseudonymised data, it can reduce the severity of the resulting confidentiality risk and the risk of negative consequences to the data subjects, provided persons to whom the data is disclosed are prevented from accessing additional data.

28. Pseudonymisation can reduce risks of function creep, i.e. the risk that personal data is further processed in a manner incompatible with the purposes for which it was collected, because processors or persons acting under the controller's or processor's authority who have access to the pseudonymised data are not able to use it for purposes whose fulfilment requires attribution to the data subjects.

29. Depending on the techniques used, assigning widely differing pseudonyms to persons with very similar identifying attributes may not only enhance confidentiality but also reduce risks to accuracy of the data, by reducing the risk of incorrectly attributing data or objects to the wrong data subjects.

30. The effectiveness of the implementation of pseudonymisation determines the extent of the reduction of risks for the data subjects and the benefits the controllers may derive from it, including the fulfilment of data-protection obligations according to Art. 24, 25 and 32 GDPR.

#### 2.2.2 Analysis of pseudonymised data and planned attribution

31. Pseudonymised data can often be usefully analysed since, in large part, the information content of the original data can still be evaluated. The insertion of pseudonyms enables the linkage of various records of pseudonymised data relating to the same person without the need to use additional information.

32. After analysis, pseudonymisation may be partially or completely reversed by: (a) identifying the data subject, (b) linking pseudonymised to original data, or (c) reconstituting original data from pseudonymised data using additional information kept by the controller for that purpose (planned attribution). This reversal should be performed by persons specifically authorised for this purpose, per Rec. 29 GDPR.

33. It may also be possible to use additional information to link different sets of pseudonymised data whose linkage was not planned at the outset. Processing implementing such linkage should likewise be performed only by persons specifically authorised for this purpose.

34. All processing operations mentioned in this section (including data set linkage) must be executed in compliance with the GDPR, observing all data protection principles under Art. 5 GDPR and relying on a legal basis under Art. 6 GDPR.

### 2.3 Pseudonymisation domain and available means for attribution

35. Controllers may define the context in which pseudonymisation is to preclude attribution of data to specific data subjects, generally on the basis of a risk analysis, subjecting the additional information to technical and organisational measures so the pseudonymised data cannot be attributed to data subjects by persons operating within that context. These guidelines call this context (the people operating in it and its attending physical and organisational aspects, including IT assets available) the **pseudonymisation domain**.

36. The pseudonymisation domain may, by choice of the pseudonymising controller, coincide with a set of foreseen legitimate recipients of the pseudonymised data.

37. The pseudonymising controller, when defining the pseudonymisation domain, may also choose to include persons who are not legitimate recipients but may attempt to gain access anyway, in order to mitigate adverse effects of such unauthorised access.

38. Depending on the objective of pseudonymisation and the controller's risk assessment, the pseudonymisation domain may encompass, e.g., only a single organisational unit of the controller, a single external recipient, all authorised or foreseen legitimate recipients, or a range of or all external entities that may attempt to gain access to the data without authorisation.

39. For effective pseudonymisation within a single organisational unit or a set of legitimate recipients, all involved controllers and processors should choose appropriate technical and organisational means, possibly including legal safeguards such as contracts if these can be effectively enforced, guaranteeing that pseudonymised data does not leave the pseudonymisation domain.

40. Controllers processing pseudonymised data should also put in place measures ensuring that actors within the pseudonymisation domain are not able to reverse the pseudonymisation, for example by limiting the resources available for processing the pseudonymised data and ensuring additional information does not enter the pseudonymisation domain.

41. If the pseudonymisation domain consists of a defined set of recipients and the measures above are effectively enforced and maintained, then only those means need be considered for attribution that can be used in the planned context of processing. Where data is pseudonymised and then processed within the same controller, the pseudonymisation domain does not encompass the controller as a whole, but only the persons processing the pseudonymised data under its authority (excluding those authorised to use additional information for attribution), the information they have at their disposal, and the systems and services they employ.

42. If a controller or processor wants to use pseudonymisation to reduce confidentiality risks from some or all unauthorised third parties, they will include those third parties in the pseudonymisation domain and assess the means they are reasonably likely to use for attribution. Relevant third parties include cyber-crime actors, but also employees or maintenance service providers acting in their own interests rather than on instructions from the controller.

43. For instance, pseudonymisation may be performed prior to transmission of the data to a processor or third party that ensures only a level of security that would not be appropriate for the processing of the original data, but is appropriate for the risk connected with processing data that cannot be attributed to data subjects.

## Definition of anonymisation (as distinguished in this text)

The guidelines do not give anonymisation a separate numbered legal definition of its own (unlike pseudonymisation, which is defined by Art. 4(5) GDPR); instead they define anonymisation negatively, by reference to when pseudonymised data stops being personal data. Per paragraph 22 above: even if all additional information retained by the pseudonymising controller has been erased, the pseudonymised data becomes anonymous only if "the conditions for anonymity are met" (i.e. attribution to a natural person is no longer possible for anyone, by any means reasonably likely to be used, not merely by the original controller). The executive summary states the same test: pseudonymised data "can be considered anonymous only if the conditions for anonymity are met." In other words, anonymisation is the state in which no additional information, held by anyone, could reasonably be used to re-attribute the data to a data subject; pseudonymisation, by contrast, is defined precisely by the continued existence of such additional information (held separately, under technical and organisational safeguards) and therefore remains personal data.

## Note on this excerpt

This excerpt reproduces the full Executive Summary, the printed Table of Contents, selected paragraphs from Section 1 (Introduction, paragraphs 1 to 9), and the complete Section 2.1 through 2.3 (Definitions and legal analysis: paragraphs 16 to 43), which is where the Art. 4(5) GDPR definition, the attribution/additional-information concepts, and the "remains personal data" statement (paragraph 22) all appear. Not included in this excerpt, because the fetch was scoped to the executive summary and definitions section per the task's own fallback instruction for a PDF-only source: Section 2.4 onward (meeting data-protection requirements, transmission to third parties, data subject rights, unauthorised reversal), Section 3 (technical measures and safeguards for pseudonymisation), the Annex of ten worked examples, and the Glossary.
