-- Insert sample jobs data
INSERT INTO jobs (
    job_title,
    company,
    platform,
    location,
    remote,
    match_score,
    posted_date,
    salary_range,
    job_description,
    requirements
) VALUES
    (
        'UI/UX Designer',
        'TechCorp',
        'linkedin',
        'Hyderabad',
        true,
        95,
        TIMEZONE('utc', NOW() - INTERVAL '2 days'),
        '$80,000 - $120,000',
        'We are looking for a talented UI/UX Designer to create exceptional user experiences for our products.',
        '- 3+ years of experience in UI/UX design\n- Proficiency in Figma\n- Experience with design systems'
    ),
    (
        'Senior UX Designer',
        'InnovateHub',
        'glassdoor',
        'Hyderabad',
        true,
        90,
        TIMEZONE('utc', NOW() - INTERVAL '1 day'),
        '$90,000 - $130,000',
        'Join our team as a Senior UX Designer and help shape the future of our digital products.',
        '- 5+ years of UX design experience\n- Portfolio of successful projects\n- Team leadership experience'
    ),
    (
        'Product Designer',
        'DesignWave',
        'indeed',
        'Hyderabad',
        false,
        85,
        TIMEZONE('utc', NOW() - INTERVAL '3 days'),
        '$70,000 - $100,000',
        'Looking for a creative Product Designer to join our fast-growing team.',
        '- Strong visual design skills\n- Experience with user research\n- Knowledge of design principles'
    ),
    (
        'UX/UI Designer',
        'Digital Dynamics',
        'naukri',
        'Hyderabad',
        true,
        88,
        TIMEZONE('utc', NOW() - INTERVAL '12 hours'),
        '$75,000 - $110,000',
        'Join us in creating beautiful and functional digital experiences.',
        '- Proven UI/UX design experience\n- Strong portfolio\n- Experience with design tools'
    ),
    (
        'Interaction Designer',
        'Google',
        'google',
        'Hyderabad',
        false,
        92,
        TIMEZONE('utc', NOW() - INTERVAL '1 hour'),
        '$100,000 - $150,000',
        'Design the next generation of user interfaces for Google products.',
        '- 4+ years of interaction design experience\n- Strong prototyping skills\n- Experience with complex applications'
    ),
    (
        'UI/UX Designer',
        'Microsoft',
        'linkedin',
        'Bangalore',
        true,
        80,
        TIMEZONE('utc', NOW() - INTERVAL '4 days'),
        '$85,000 - $125,000',
        'Join Microsoft and help design the future of technology.',
        '- Experience with enterprise applications\n- Strong UX research skills\n- Knowledge of accessibility standards'
    ),
    (
        'Product Designer',
        'Amazon',
        'glassdoor',
        'Hyderabad',
        false,
        87,
        TIMEZONE('utc', NOW() - INTERVAL '5 hours'),
        '$90,000 - $140,000',
        'Design customer-centric experiences for Amazon products.',
        '- E-commerce design experience\n- Strong problem-solving skills\n- Experience with mobile design'
    ),
    (
        'UX Designer',
        'Flipkart',
        'naukri',
        'Bangalore',
        true,
        82,
        TIMEZONE('utc', NOW() - INTERVAL '6 days'),
        '$70,000 - $100,000',
        'Shape the future of e-commerce design at Flipkart.',
        '- E-commerce UX experience\n- Knowledge of user behavior\n- Prototyping skills'
    ),
    (
        'UI Designer',
        'Adobe',
        'indeed',
        'Hyderabad',
        true,
        89,
        TIMEZONE('utc', NOW() - INTERVAL '8 hours'),
        '$95,000 - $135,000',
        'Create beautiful interfaces for creative professionals.',
        '- Strong visual design skills\n- Experience with Adobe tools\n- Knowledge of design systems'
    ),
    (
        'Senior Product Designer',
        'Apple',
        'linkedin',
        'Hyderabad',
        false,
        94,
        TIMEZONE('utc', NOW() - INTERVAL '2 hours'),
        '$120,000 - $180,000',
        'Join Apple and help design revolutionary products.',
        '- 7+ years of product design experience\n- Excellence in UI/UX\n- Strong leadership skills'
    ); 