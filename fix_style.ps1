$content = Get-Content "c:\Users\이찬서\OneDrive\바탕 화면\founderex_landing\style.css" -Encoding UTF8
$newContent = $content[0..1521] + $content[1524..($content.Length-1)]
$newContent | Set-Content "c:\Users\이찬서\OneDrive\바탕 화면\founderex_landing\style.css" -Encoding UTF8
