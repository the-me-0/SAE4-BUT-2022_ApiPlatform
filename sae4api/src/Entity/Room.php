<?php

namespace App\Entity;

use App\Repository\RoomRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\Validator\Constraints as Assert;

use App\Controller\GetRoomLastData;
use App\Controller\GetRoomsAlerts;

use App\Listener\RoomListener;
/**
 * @ApiResource(
 *     collectionOperations={
 *          "get",
 *          "post",
 *          "alerts"={
 *              "method"="GET",
 *              "path"="/rooms/alerts",
 *              "controller"=GetRoomsAlerts::class
 *          }
 *     },
 *     itemOperations={"get",
 *          "put",
 *          "delete",
 *          "lastData"={
 *              "method"="GET",
 *              "path"="/rooms/{id}/lastdata",
 *              "controller"=GetRoomLastData::class,
 *              "openapi_context"={
 *                  "parameters"={
 *                      {"in"="query", "name"="type", "type"="string", "required"=false}
 *                  }
 *              }
 *          }
 *     },
 *     normalizationContext={"groups"={"room:read"}},
 *     denormalizationContext={"groups"={"room:write"}}
 * )
 * @ORM\Entity(repositoryClass=RoomRepository::class)
 * @ORM\EntityListeners({"App\Listener\RoomListener"})
 */
class Room
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"room:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"room:read", "room:write"})
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"room:read", "room:write"})
     */
    private $tag;

    /**
     * @ORM\OneToOne(targetEntity=Advice::class, cascade={"persist", "remove"})
     * @Groups({"room:read"})
     */
    private $advice;

    public function __construct()
    {
        $this->advice = null;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function requestLastData($type, $nLast = 1)
    {
        $client = HttpClient::create();
        $option = [
            'headers' => [
                'Content-Type' => 'application/json',
                'dbname' => 'sae34bd'.$this->tagToTeam($this->tag),
                'username' => 'x2eq1',
                'userpass' => '2dxc3S45jHFUXA68'
            ],
            'query' => [
                'nom' => $type,
                'tag' => $this->tag,
                'limit' => $nLast
            ]
        ];
        $response = $client->request('GET', 'https://sae34.k8s.iut-larochelle.fr/api/captures/last', $option);
        if($response->getStatusCode() != 200 || $response->toArray() == null) {
            return null;
        } else {
            $values = $response->toArray();
            if($nLast > 1) {
                $returnArray = [];
                foreach ($values as $value) {
                    $returnArray[] = floatval($value['valeur']);
                }
                return $returnArray;
            }
            $last_value = end($values)['valeur'];
            return floatval($last_value);
        }
    }

    /**
     * @return float|null
     */
    public function getTemperature(): ?float
    {
        return $this->requestLastData('temp');
    }

    /**
     * @return float|null
     */
    public function getCo2(): ?float
    {
        return $this->requestLastData('co2');
    }

    public function getTag(): ?string
    {
        return $this->tag;
    }

    public function setTag(string $tag): self
    {
        $this->tag = $tag;

        return $this;
    }
    public function tagToTeam($tag)
    {
        switch ($tag) {
            case 1:
                return "x1eq1";
                break;
            case 2:
                return "x1eq2";
                break;
            case 3:
                return "x1eq3";
                break;
            case 4:
                return "x2eq1";
                break;
            case 5:
                return "x2eq2";
                break;
            case 6:
                return "x2eq3";
                break;
            case 7:
                return "y1eq1";
                break;
            case 8:
                return "y1eq2";
                break;
            case 9:
                return "y1eq3";
                break;
            case 10:
                return "y2eq1";
                break;
            case 11:
                return "y2eq2";
                break;
            case 12:
                return "y2eq3";
                break;
            case 13:
                return "z1eq1";
                break;
            case 14:
                return "z1eq2";
                break;
            case 15:
                return "z1eq3";
                break;
            default:
                return null;
                break;
        }
    }

    /**
     * @Groups({"room:read"})
     * @return Advice|null
     */
    public function getAdvice(): ?Advice
    {
        return $this->advice;
    }

    public function setAdvice(?Advice $advice): self
    {
        $this->advice = $advice;

        return $this;
    }
}
