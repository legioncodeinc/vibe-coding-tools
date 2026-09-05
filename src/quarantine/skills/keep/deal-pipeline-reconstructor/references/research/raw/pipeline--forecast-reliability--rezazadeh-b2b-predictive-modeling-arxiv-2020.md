# A Generalized Flow for B2B Sales Predictive Modeling (Rezazadeh, 2020)

- **Title:** A Generalized Flow for B2B Sales Predictive Modeling
- **Author:** Alireza Rezazadeh, Electrical and Computer Engineering Department, University
  of Illinois at Chicago
- **URL:** https://arxiv.org/pdf/2002.01441
- **Fetched:** 2026-08-17
- **Source type:** academic (arXiv preprint, arXiv:2002.01441v2 cs.LG)
- **Date:** July 3, 2020

## Window note

Outside the 6-month window. Retained for its explicit inventory of what a real B2B
opportunity record actually contains, which is the best available answer to "what fields
does a deal need".

## Extracted content

### Abstract, as quoted

"Predicting the outcome of sales opportunities is a core part of successful business
management... This workflow consists of two pipelines: (1) An ML pipeline to train
probabilistic predictive models on the historical sales opportunities data. In this
pipeline, data is enriched with an extensive feature enhancement step and then used to
train an ensemble of ML classification models in parallel. (2) A prediction pipeline to
utilize the trained ML model and infer the likelihood of winning new sales opportunities
along with calculating optimal decision boundaries."

### Feature inventory

The paper works from 20 raw features, including:

- Project characteristics: Opportunity Type, Project Duration, Total Contract Value
- Customer information: Account, Account Location
- Internal segmentation: Business Unit, Practice, Segment

The paper does not identify which of these features is most predictive.

### Data quality, quoted

"Less than 1% of the dataset contained missing values... sales records with a missing value
were dropped."

### Outcome balance, quoted

"Out of all closed sales records ~58% were labeled as 'won' in their final sales status."

### Explicit absences in this paper

- SALES STAGE is not used as a predictor and is not discussed anywhere in the paper.
- TIME or AGE of the opportunity is not examined. Temporal features are absent.

## Claims this source supports

1. A well-maintained enterprise CRM dataset had under 1% missing values, and the authors
   could still afford to DROP every incomplete record. That is the opposite end of the
   spectrum from the operator this skill serves, whose record set is entirely missing. The
   contrast establishes that published pipeline modelling assumes a data condition that
   does not exist in the target user's business.
2. A serious predictive treatment of B2B deal outcome omitted sales stage entirely as a
   feature. That is a notable negative signal about how much information a stage label
   actually carries, and it argues for showing stage as a communication device with its
   evidence attached rather than as a prediction.
3. The core deal identity fields used in practice are the ACCOUNT plus the OPPORTUNITY
   TYPE plus commercial terms, which supports modelling a deal as person plus company plus
   opportunity rather than as a bare contact.
