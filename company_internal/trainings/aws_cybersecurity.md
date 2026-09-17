---
tags:
  - aws
  - cybersecurity
  - knowbe4
---

## Security categories

- **Identify:** understand security risks by managing:
	- Inventory: know the data, and which are vulnerable
	- Logging: know what is happening to flag suspicious activity
- **Protect:** create safeguards to repel attacks
	- AWS services related to user identity verification, data/API access, development
- **Detect:** routinize activities for identifying suspicious behavior
- **Respond:** prepare gameplans to enact on the occasion of a security breach
- **Recover:** restore application security and resilience following a breach

## Example: Image injection attack

Premise: Image upload doesn't check inputs, allowing injection of virus to be triggered when another user views an image.

Tools:
- **Amazon Guard Duty:** Continuously monitor application for malicious activity
- **AWS Web Application Firewall:** protect and filter web traffic to guard against common exploits

## Code currency

Outdated components must be updated **as soon as they are detected**

- **AWS CodePipeline** and **AWS CodeArtifact** scan for vulnerabilities in dependencies
- **AmazonInspector** audits code for compliance and proposes plans for remediation of discovered vulnerabilities
- **AWS Elastic Beanstalk** simplifies application deployments and automates updating of underlying components
- **AWS Lambda** enables serverless compute managed by Amazon (offloading any security concerns)

## Broken access control

Users should have strictly defined permissions for what they can access in an application.
Entry points should be **secured.**

Example failure pattern: employee dashboard accessed via ID arg in url $\rightarrow$ inputting another employee ID to url **without logging in** gives access to that employee's dashboard

### Eight common access vulnerabilities

1. **Violate:** least privilege / deny by default principle not upheld by app design
2. **Bypass:** circumvent safety checks by modifying URL, application state, HTML, API requests
3. **Permit:** insecure access of account using a direct object references
4. **Access:** utilizing API w/o access controls for the given methods
5. **Elevate:** acting as a user/admin w/o proper login
6. **Manipulate:** insecure modification of *JSON web toke*n (JWT), cookie or hidden field to elevate privileges
7. **Misconfigure:** misconfigure *cross-origin requests* (CORS) to allow API access from insecure sources
8. **Force:** force browser to render unauthenticated pages

## Server-side request forgery

Aka. **SSRF**.
Sending a request to unexpected destination, bypassing external network access control

### Five prevention steps

- **Sanitize:** validate all input data from client, e.g. removing and escaping unexpected characters
- **Enforce:** restrict requests based on whitelist code
- **Verify:** test raw response against anticipated response, ensure only expected resources are accessed
- **Disable:** add HTTPS certificate to browser rather than redirecting URL from HTTPS to HTTP
- **Defend:** filter requests with firewall

## Injection attacks

Sources:

- SQL
- NoSQL
- OS command
- ORM
- LDAP
- OGNL
- XSS

Defenses may consist of **RDS filters** to ensure inputs are treated as data and not code, or **firewalls** that block patterns resembling SQL injection.

## Cryptographic failure

Caused by:

- Weak/old algorithms
- Unencrypted passwords (storage or transmission)

Use tools like **Amazon Key Management Services** to manage use of encryption keys in an application.

## Security misconfiguration

Incorrect construction of a system (e.g. not changing defaults or enabling unnecessary features).

Common targets:

- Libraries and dependencies
- Components
- Serialized data

### Misconfiguration examples

- **Default/weak config settings:** default passwords, leaving debug mode on, unnecessary services, etc.
- **Insecure HTTP headers:** can expose to *Cross-Site Scripting* (XSS), *Cross-Site Request Forgery* (CSRF), Clickjacking
- **Improper access controls:** giving excessive privileges, not implementing *role-based access control* (RBAC)
- **Open directory listings:** can expose sensitive files/data
- **Outdated or unpatched components:** leaves known vulnerabilities unadressed

### Preventing misconfiguration

- **AWS trusted advisor:** recommendations for optimizing AWS config
- **AWS config:** continuous monitoring of AWS resources for dangerous changes
- **Amazon inspector:** assesses security compliance of application

## Software and data integrity failures

Proper software integrity requires:

- Digital signatures
- Trusted repositories
- Verified software supply chain
- Segregation and properly configure CI/CD
- Signed & encrypted serialized data

## Security logging and monitoring failure

Lack of proper logging and monitoring $\Rightarrow$ attacks go unaddressed and may be repeated.
Proper security hygiene includes:

- Comprehensive logging and monitoring
- Constant analysis of logs and anomaly detection
- Regular security audits

